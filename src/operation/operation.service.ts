import { Injectable } from '@nestjs/common';
import { CreateOperationDto } from './dto/create-operation.dto';
import { UpdateOperationDto } from './dto/update-operation.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { AreaService } from 'src/area/area.service';
import { TaskService } from 'src/task/task.service';
import { ClientService } from 'src/client/client.service';

/**
 * Servicio para gestionar operaciones
 * @class OperationService
 */
@Injectable()
export class OperationService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private areaService: AreaService,
    private taskService: TaskService,
    private clientService: ClientService,
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
      const validate = await this.findOne(id);
      if (validate['status'] === 404) {
        return validate;
      }
      if (updateOperationDto.id_user) {
        const validateUser = await this.userService.findOneById(
          updateOperationDto.id_user,
        );
        if (validateUser['status'] === 404) {
          return validateUser;
        }
      }
      const response = this.prisma.operation.update({
        where: { id },
        data: updateOperationDto,
      });
      return response;
    } catch (error) {
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
      const validateUser = await this.userService.findOneById(
        createOperationDto.id_user,
      );
      if (validateUser['status'] === 404) {
        return validateUser;
      }
      const validateArea = await this.areaService.findOne(
        createOperationDto.id_area,
      );
      if (validateArea['status'] === 404) {
        return validateArea;
      }
      const validateTask = await this.taskService.findOne(
        createOperationDto.id_task,
      );
      if (validateTask['status'] === 404) {
        return validateTask;
      }
      const validateClient = await this.clientService.findOne(createOperationDto.id_client);
      if (validateClient['status'] === 404) {
        return validateClient;
      }
      const { workerIds, ...operationData } = createOperationDto;

      if (workerIds && workerIds.length > 0) {
        const existingWorkers = await this.prisma.worker.findMany({
          where: {
            id: {
              in: workerIds,
            },
          },
          select: {
            id: true,
          },
        });

        const existingWorkerIds = existingWorkers.map((worker) => worker.id);

        const nonExistingWorkerIds = workerIds.filter(
          (workerId) => !existingWorkerIds.includes(workerId),
        );

        if (nonExistingWorkerIds.length > 0) {
          const nonExistingWorkers = `Workes not found ${nonExistingWorkerIds.join(', ')}`;
          return { message: nonExistingWorkers, status: 404 };
        }
      }

      const operation = await this.prisma.operation.create({
        data: operationData,
      });

      let response = {};
      if (workerIds && workerIds.length > 0) {
        const workerOperations = workerIds.map((workerId) => ({
          id_operation: operation.id,
          id_worker: workerId,
        }));

       response = await this.prisma.operation_Worker.createMany({
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
     

      return response;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
