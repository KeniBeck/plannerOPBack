import { Injectable } from '@nestjs/common';
import { CreateOperationDto } from './dto/create-operation.dto';
import { UpdateOperationDto } from './dto/update-operation.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { OperationWorkerService } from 'src/operation-worker/operation-worker.service';
import { StatusOperation } from '@prisma/client';
import { OperationFinderService } from './services/operation-finder.service';
import { OperationRelationService } from './services/operation-relation.service';

/**
 * Servicio para gestionar operaciones
 * @class OperationService
 */
@Injectable()
export class OperationService {
  constructor(
    private prisma: PrismaService,
    private operationWorkerService: OperationWorkerService,
    private finderService: OperationFinderService,
    private relationService: OperationRelationService,
  ) {}
  /**
   * Obtiene todas las operaciones
   * @returns Lista de operaciones con relaciones incluidas
   */
  async findAll() {
    return await this.finderService.findAll();
  }
  /**
   * Busca una operación por su ID
   * @param id - ID de la operación a buscar
   * @returns Operación encontrada o mensaje de error
   */
  async findOne(id: number) {
    return await this.finderService.findOne(id);
  }
  /**
   * Encuentra todas las operaciones activas (IN_PROGRESS y PENDING) sin filtros de fecha
   * @returns Lista de operaciones activas o mensaje de error
   */
  async findActiveOperations(statuses: StatusOperation[]) {
    return await this.finderService.findByStatuses(statuses);
  }
  /**
   *  Busca operaciones por rango de fechas
   * @param start Fecha de inicio
   * @param end Fecha de fin
   * @returns resultado de la busqueda
   */
  async findOperationRangeDate(start: Date, end: Date) {
    return await this.finderService.findByDateRange(start, end);
  }
  /**
   * Encuentra operaciones asociadas a un usuario específico
   * @param id_user ID del usuario para buscar operaciones
   * @returns  Lista de operaciones asociadas al usuario o mensaje de error
   */
  async findOperationByUser(id_user: number) {
    return await this.finderService.findByUser(id_user);
  }
  /**
   * Crea una nueva operación y asigna trabajadores
   * @param createOperationDto - Datos de la operación a crear
   * @returns Operación creada
   */
  async createWithWorkers(createOperationDto: CreateOperationDto) {
    try {
      // Validaciones
      if (createOperationDto.id_user === undefined) {
        return { message: 'User ID is required', status: 400 };
      }

      // Extraer y validar IDs de trabajadores
      const { workerIds = [], groups = [] } = createOperationDto;
      const scheduledWorkerIds =
        this.relationService.extractScheduledWorkerIds(groups);
      const allWorkerIds = [...workerIds, ...scheduledWorkerIds];

      // Validar todos los IDs
      const validationResult = await this.relationService.validateOperationIds({
        id_area: createOperationDto.id_area,
        id_task: createOperationDto.id_task,
        id_client: createOperationDto.id_client,
        workerIds: allWorkerIds,
        inChargedIds: createOperationDto.inChargedIds,
      });

      if (validationResult) return validationResult;

      // Crear la operación
      const operation = await this.createOperation(createOperationDto);

      // Asignar trabajadores y encargados
      await this.relationService.assignWorkersAndInCharge(
        operation.id,
        workerIds,
        groups,
        createOperationDto.inChargedIds || [],
      );

      return { id: operation.id };
    } catch (error) {
      console.error('Error creating operation with workers:', error);
      throw new Error(error.message);
    }
  }
  /**
   * Crea un registro de operación
   * @param operationData - Datos de la operación
   * @returns Operación creada
   */
  private async createOperation(operationData: CreateOperationDto) {
    const {
      workerIds,
      groups,
      inChargedIds,
      dateStart,
      dateEnd,
      timeStrat,
      timeEnd,
      ...restOperationData
    } = operationData;

    return this.prisma.operation.create({
      data: {
        ...restOperationData,
        id_user: operationData.id_user as number,
        dateStart: dateStart ? new Date(dateStart) : '',
        dateEnd: dateEnd ? new Date(dateEnd) : null,
        timeStrat: timeStrat || '',
        timeEnd: timeEnd || null,
      },
    });
  }
  /**
   * Actualiza una operación existente
   * @param id - ID de la operación a actualizar
   * @param updateOperationDto - Datos de actualización
   * @returns Operación actualizada
   */
  async update(id: number, updateOperationDto: UpdateOperationDto) {
    try {
      // Verificar que la operación existe
      const validate = await this.findOne(id);
      if (validate['status'] === 404) {
        return validate;
      }

      // Validar IDs de encargados
      const validationResult =
        await this.relationService.validateInChargedIds(updateOperationDto);
      if (validationResult) return validationResult;

      // Extraer datos para actualización
      const {
        workers,
        inCharged,
        dateStart,
        dateEnd,
        timeStrat,
        timeEnd,
        ...directFields
      } = updateOperationDto;

      // Preparar datos para actualizar
      const operationUpdateData = this.prepareOperationUpdateData(
        directFields,
        dateStart,
        dateEnd,
        timeStrat,
        timeEnd,
      );

      // Actualizar operación
      await this.prisma.operation.update({
        where: { id },
        data: operationUpdateData,
      });

      // Manejar cambio de estado
      if (directFields.status === StatusOperation.COMPLETED) {
        await this.operationWorkerService.releaseAllWorkersFromOperation(id);
      }

      // Procesar actualizaciones de relaciones
      await this.relationService.processRelationUpdates(id, workers, inCharged);

      // Obtener la operación actualizada
      const updatedOperation = await this.findOne(id);
      return updatedOperation;
    } catch (error) {
      console.error('Error en actualización de operación:', error);
      throw new Error(error.message);
    }
  }
  /**
   * Prepara los datos para actualizar una operación
   * @param directFields - Campos directos a actualizar
   * @param dateStart - Fecha de inicio
   * @param dateEnd - Fecha de fin
   * @param timeStrat - Hora de inicio
   * @param timeEnd - Hora de fin
   * @returns Objeto con datos preparados para actualizar
   */
  private prepareOperationUpdateData(
    directFields: any,
    dateStart?: string,
    dateEnd?: string,
    timeStrat?: string,
    timeEnd?: string,
  ) {
    const updateData = { ...directFields };

    if (dateStart) updateData.dateStart = new Date(dateStart);
    if (dateEnd) updateData.dateEnd = new Date(dateEnd);
    if (timeStrat) updateData.timeStrat = timeStrat;
    if (timeEnd) updateData.timeEnd = timeEnd;

    return updateData;
  }
  /**
   * Elimina una operación por su ID
   * @param id - ID de la operación a eliminar
   * @returns Operación eliminada
   */
  async remove(id: number) {
    try {
      const validateOperation = await this.findOne(id);
      if (validateOperation['status'] === 404) {
        return validateOperation;
      }

      // Eliminar todos los trabajadores asignados a la operación
      await this.operationWorkerService.releaseAllWorkersFromOperation(id);
      const response = await this.prisma.operation.delete({
        where: { id },
      });
      return response;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}