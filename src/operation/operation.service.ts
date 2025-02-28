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
  async create(createOperationDto: CreateOperationDto) {
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
      const validateTask = await this.taskService.findOne(
        createOperationDto.id_task) !== 'Task not found';
      if (validateTask) {
        return 'Task not found';
      }
      const response = await this.prisma.operation.create({
        data: createOperationDto,
      });
      return response;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findAll() {
    try {
      const response = await this.prisma.operation.findMany();
      return response;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findOne(id: number) {
    try {
      const response = await this.prisma.operation.findUnique({
        where: { id },
      });
      if (!response) {
        return 'Operation not found';
      }
      return response;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  update(id: number, updateOperationDto: UpdateOperationDto) {
    try {
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
      const response = await this.prisma.operation.delete({
        where: { id },
      });
      return response;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
