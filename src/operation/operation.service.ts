import { Injectable } from '@nestjs/common';
import { CreateOperationDto } from './dto/create-operation.dto';
import { UpdateOperationDto } from './dto/update-operation.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ValidationService } from 'src/common/validation/validation.service';

/**
 * Servicio para gestionar operaciones
 * @class OperationService
 */
@Injectable()
export class OperationService {
  constructor(
    private prisma: PrismaService,
    private validationService: ValidationService,
  ) {}
  /**
   * Obtiene todas las operaciones
   * @returns Lista de operaciones con relaciones incluidas
   */
  async findAll() {
    try {
      const response = await this.prisma.operation.findMany({
        include: {
          jobArea: {
            select: {
              id: true,
              name: true,
            },
          },
          task: {
            select: {
              id: true,
              name: true,
            },
          },
          workers: {
            select: {
              id_worker: true,
            },
          },
          inChargeOperation: {
            select: {
              id_user: true,
            },
          },
        },
      });

      const trasnformedResponse = response.map((res) => {
        const { id_area, id_task, ...rest } = res;
        return rest;
      });
      return trasnformedResponse;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  /**
   * Busca una operación por su ID
   * @param id - ID de la operación a buscar
   * @returns Operación encontrada o mensaje de error
   */
  async findOne(id: number) {
    try {
      const response = await this.prisma.operation.findUnique({
        where: { id },
        include: {
          jobArea: {
            select: {
              id: true,
              name: true,
            },
          },
          task: {
            select: {
              id: true,
              name: true,
            },
          },
          workers: {
            select: {
              id_worker: true,
            },
          },
          inChargeOperation: {
            select: {
              id_user: true,
            },
          },
        },
      });
      if (!response) {
        return { message: 'Operation not found', status: 404 };
      }
      const { id_area, id_task, ...rest } = response;
      return rest;
    } catch (error) {
      throw new Error(error.message);
    }
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

      // 1. Extraer los datos de actualización
      const { workers, inCharged, ...directFields } = updateOperationDto;

      // verificar si se esta cambiando el estado a COMPLETED
      const isCompletingOperation = directFields.status === 'COMPLETED';

      // 2. Actualizar campos directos de la operación
      await this.prisma.operation.update({
        where: { id },
        data: directFields,
      });

      // si se esta completando la operación, se liberan los trabajadores
      if (isCompletingOperation) {
        // Obtener los trabajadores de esta operación desde la tabla intermedia
        const operationWorkers = await this.prisma.operation_Worker.findMany({
          where: { id_operation: id },
          select: { id_worker: true },
        });

        const workerIds = operationWorkers.map((ow) => ow.id_worker);
        // Actualizar el estado de los trabajadores a AVALIABLE
        if (workerIds.length > 0) {
          await this.prisma.worker.updateMany({
            where: {
              id: { in: workerIds },
              status: { not: 'AVALIABLE' },
            },
            data: { status: 'AVALIABLE' },
          });
        }
      }

      // 3. Manejar las relaciones de trabajadores si se proporcionaron
      if (workers) {
        // 3.1 Procesar CONNECT: añadir nuevos trabajadores
        if (workers.connect && Array.isArray(workers.connect)) {
          const newWorkerIds = workers.connect.map((item) => item.id);

          if (newWorkerIds.length > 0) {
            // Validar que todos los trabajadores existen usando ValidationService
            const workerValidation =
              await this.validationService.validateAllIds({
                workerIds: newWorkerIds,
              });

            if (
              workerValidation &&
              'status' in workerValidation &&
              workerValidation.status === 404
            ) {
              return workerValidation;
            }

            // Obtener trabajadores que ya están asignados a esta operación
            const currentWorkers = await this.prisma.operation_Worker.findMany({
              where: { id_operation: id },
              select: { id_worker: true },
            });

            const currentWorkerIds = currentWorkers.map(
              (worker) => worker.id_worker,
            );

            // Filtrar para solo añadir trabajadores que no están ya asignados
            const workersToAdd = newWorkerIds.filter(
              (workerId) => !currentWorkerIds.includes(workerId),
            );

            if (workersToAdd.length > 0) {
              // Crear nuevas relaciones solo para trabajadores no asignados previamente
              await this.prisma.operation_Worker.createMany({
                data: workersToAdd.map((workerId) => ({
                  id_operation: id,
                  id_worker: workerId,
                })),
                skipDuplicates: true, // Evita duplicados
              });

              // Actualizar estado de los nuevos trabajadores
              await this.prisma.worker.updateMany({
                where: { id: { in: workersToAdd } },
                data: { status: 'ASSIGNED' },
              });
            }
          }
        }

        // 3.2 Procesar DISCONNECT: eliminar trabajadores específicos
        if (workers.disconnect && Array.isArray(workers.disconnect)) {
          const workerIdsToRemove = workers.disconnect.map((item) => item.id);

          if (workerIdsToRemove.length > 0) {
            // Validar que todos los trabajadores existen
            const workerValidation =
              await this.validationService.validateAllIds({
                workerIds: workerIdsToRemove,
              });

            if (
              workerValidation &&
              'status' in workerValidation &&
              workerValidation.status === 404
            ) {
              return workerValidation;
            }

            // Eliminar solo las relaciones especificadas
            await this.prisma.operation_Worker.deleteMany({
              where: {
                id_operation: id,
                id_worker: { in: workerIdsToRemove },
              },
            });

            // Actualizar estado de los trabajadores eliminados
            await this.prisma.worker.updateMany({
              where: { id: { in: workerIdsToRemove } },
              data: { status: 'AVALIABLE' },
            });
          }
        }
      }
      // 4 Manejar las relaciones de encargados si se proporcionaron
      if (inCharged) {
        //4.1 Manejar Conect de inCharged
        if (inCharged.connect && Array.isArray(inCharged.connect)) {
          const inChargedIds = inCharged.connect.map((item) => item.id);

          if (inChargedIds.length > 0) {
            const inChargedValidation =
              await this.validationService.validateAllIds({ inChargedIds });
            if (
              inChargedValidation &&
              'status' in inChargedValidation &&
              inChargedValidation.status === 404
            ) {
              return inChargedValidation;
            }

            //obtener los encargados que ya estan asignados a esta operacion
            const currentInCharged =
              await this.prisma.inChargeOperation.findMany({
                where: { id_operation: id },
                select: { id_user: true },
              });

            const currentInChargedIds = currentInCharged.map(
              (inCharged) => inCharged.id_user,
            );

            // Filtrar para solo añadir encargados que no estan ya asignados
            const inChargedToAdd = inChargedIds.filter(
              (inChargedId) => !currentInChargedIds.includes(inChargedId),
            );
            if (inChargedToAdd.length > 0) {
              // Crear nuevas relaciones
              await this.prisma.inChargeOperation.createMany({
                data: inChargedToAdd.map((inChargedId) => ({
                  id_operation: id,
                  id_user: inChargedId,
                })),
                skipDuplicates: true, // Evitar duplicados
              });
            }
          }
        }

        // 4.2 Manejar Disconect de inCharged
        if (inCharged?.disconnect && Array.isArray(inCharged.disconnect)) {
          const inChargedIds = inCharged.disconnect.map((item) => item.id);

          if (inChargedIds.length > 0) {
            const inChargedValidation =
              await this.validationService.validateAllIds({ inChargedIds });
            if (
              inChargedValidation &&
              'status' in inChargedValidation &&
              inChargedValidation.status === 404
            ) {
              return inChargedValidation;
            }
            // Eliminar solo las relaciones especificadas
            await this.prisma.inChargeOperation.deleteMany({
              where: {
                id_operation: id,
                id_user: { in: inChargedIds },
              },
            });
          }
        }
      }

      // 5. Obtener la operación actualizada con sus relaciones
      const updatedOperation = await this.findOne(id);

      return updatedOperation;
    } catch (error) {
      console.error('Error en actualización de operación:', error);
      throw new Error(error.message);
    }
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
      const response = await this.prisma.operation.delete({
        where: { id },
      });
      return response;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  /**
   * Crea una nueva operación y asigna trabajadores
   * @param createOperationDto - Datos de la operación a crear
   * @returns Operación creada
   */
  async createWithWorkers(createOperationDto: CreateOperationDto) {
    try {
      // Validar todos los IDs en una sola llamada
      if (createOperationDto.id_user === undefined) {
        return { message: 'User ID is required', status: 400 };
      }
      const validation = await this.validationService.validateAllIds({
        id_area: createOperationDto.id_area,
        id_task: createOperationDto.id_task,
        id_client: createOperationDto.id_client,
        workerIds: createOperationDto.workerIds,
        inChargedIds: createOperationDto.inChargedIds,
      });
      // Si hay un error (tiene propiedad status), retornarlo
      if (validation && 'status' in validation && validation.status === 404) {
        return validation;
      }
      const { workerIds, inChargedIds, ...operationData } = createOperationDto;

      // Crear la operación

      const operation = await this.prisma.operation.create({
        data: { ...operationData, id_user: createOperationDto.id_user },
      });

      // Asignar trabajadores si existen
      if (workerIds && workerIds.length > 0) {
        const workerOperations = workerIds.map((workerId) => ({
          id_operation: operation.id,
          id_worker: workerId,
        }));
        await this.prisma.operation_Worker.createMany({
          data: workerOperations,
        });
        await this.prisma.worker.updateMany({
          where: {
            id: {
              in: workerIds,
            },
          },
          data: {
            status: 'ASSIGNED',
          },
        });
      }

      // Asignar responsables si existen
      if (inChargedIds && inChargedIds.length > 0) {
        const inChargedOperations = inChargedIds.map((inChargedId) => ({
          id_operation: operation.id,
          id_user: inChargedId,
        }));
        await this.prisma.inChargeOperation.createMany({
          data: inChargedOperations,
        });
      }

      return { id: operation.id };
    } catch (error) {
      throw new Error(error.message);
    }
  }
  /**
   *  Busca operaciones por rango de fechas
   * @param start Fecha de inicio
   * @param end Fecha de fin
   * @returns resultado de la busqueda
   */
  async findOperationRangeDate(start: Date, end: Date) {
    try {
      const response = await this.prisma.operation.findMany({
        where: {
          AND: [
            {
              dateStart: {
                gte: start,
              },
            },
            {
              dateEnd: {
                lte: end,
              },
            },
          ],
        },
      });
      if (response.length === 0) {
        return { message: 'No operations found in this range', status: 404 };
      }
      return response;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  /**
   * Encuentra todas las operaciones activas (IN_PROGRESS y PENDING) sin filtros de fecha
   * @returns Lista de operaciones activas o mensaje de error
   */
  async findActiveOperations() {
    try {
      const response = await this.prisma.operation.findMany({
        where: {
          status: {
            in: ['INPROGRESS', 'PENDING'],
          },
        },
        include: {
          task: {
            select: {
              id: true,
              name: true,
            },
          },
          client: {
            select: {
              id: true,
              name: true,
            },
          },
          workers: {
            select: {
              id_worker: true,
            },
          },
        },
        orderBy: {
          dateStart: 'asc', // Ordenar por fecha de inicio ascendente
        },
      });

      if (response.length === 0) {
        return { message: 'No active operations found', status: 404 };
      }

      return response;
    } catch (error) {
      console.error('Error finding active operations:', error);
      throw new Error(`Error finding active operations: ${error.message}`);
    }
  }

  async findOperationByUser(id_user: number) {
    try {
      const response = await this.prisma.operation.findMany({
        where: {
          id_user,
        },
        include: {
          jobArea: {
            select: {
              id: true,
              name: true,
            },
          },
          task: {
            select: {
              id: true,
              name: true,
            },
          },
          workers: {
            select: {
              id_worker: true,
            },
          },
        },
      });
      if (response.length === 0) {
        return { message: 'No operations found for this user', status: 404 };
      }
      return response;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
