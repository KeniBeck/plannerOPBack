import { Injectable } from '@nestjs/common';
import { CreateOperationDto } from './dto/create-operation.dto';
import { UpdateOperationDto } from './dto/update-operation.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { AreaService } from 'src/area/area.service';
import { TaskService } from 'src/task/task.service';

@Injectable()
export class OperationService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private areaService: AreaService,
    private taskService: TaskService,
  ) {}
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
        return 'Operation not found';
      }
      const { id_area, id_task, ...rest } = response;
      return rest;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async update(id: number, updateOperationDto: UpdateOperationDto) {
    try {
      const validate = (await this.findOne(id)) != 'Operation not found';
      if (!validate) {
        return 'Operation not found';
      }
      if (updateOperationDto.id_user) {
        const validateUser =
          (await this.userService.findOneById(updateOperationDto.id_user)) !=
          'User not found';
        if (!validateUser) {
          return 'User not found';
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

  async remove(id: number) {
    try {
      const validateUser = (await this.findOne(id)) != 'Operation not found';
      if (!validateUser) {
        return 'Operation not found';
      }
      const validateOperation =
        (await this.findOne(id)) != 'Operation not found';
      if (!validateOperation) {
        return 'Operation not found';
      }
      const response = await this.prisma.operation.delete({
        where: { id },
      });
      return response;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async createWithWorkers(createOperationDto: CreateOperationDto) {
    try {
      const validateUser =
        (await this.userService.findOneById(createOperationDto.id_user)) !==
        'User not found';
      if (!validateUser) {
        return 'User not found';
      }
      const validateArea =
        (await this.areaService.findOne(createOperationDto.id_area)) !==
        'Area not found';
      if (!validateArea) {
        return 'Area not found';
      }
      const validateTask =
        (await this.taskService.findOne(createOperationDto.id_task)) !==
        'Task not found';
      if (!validateTask) {
        return 'Task not found';
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
          return{nonExistingWorkers, status: 404};
        }
      }

      const operation = await this.prisma.operation.create({
        data: operationData,
      });

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

      return this.findOne(operation.id);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
