import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { stat } from 'fs';

@Injectable()
export class TaskService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}
  async create(createTaskDto: CreateTaskDto) {
    try {
      const { id_user, name } = createTaskDto;
      const validateUser =
        await this.userService.findOneById(id_user)

      if (validateUser["status"] === 404) {
        return validateUser;
      }

      const validateTask =
        await this.findOneTaskName(name);
      if (validateTask["status"] !== 404) {
        return {message:'Task already exists',status: 409};
      }
      const response = await this.prisma.task.create({
        data: createTaskDto,
      });
      return response;
    } catch (error) {
      throw new Error('Error create Task');
    }
  }

  async findOneTaskName(name: string) {
    try {
      const response = await this.prisma.task.findMany({
        where: {
          name: {
            equals: name,
            mode: 'insensitive',
          },
        },
      });
      if (response.length === 0) {
        return {message:'Task not found', status: 404};
      }
      return response;
    } catch (error) {
      throw new Error('Error get Task');
    }
  }

  async findAll() {
    try {
      const response = await this.prisma.task.findMany();
      return response;
    } catch (error) {
      throw new Error('Error get all Task');
    }
  }

  async findOne(id: number) {
    try {
      const response = await this.prisma.task.findUnique({
        where: {
          id: id,
        },
      });
      if (!response) {
        return {message:'Task not found', status: 404};
      }
      return response;
    } catch (error) {
      throw new Error('Error get Task');
    }
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    try {
      const validateTask = await this.findOne(id);
      if (validateTask["status"] === 404) {
        return validateTask;
      }

      if (updateTaskDto.name && updateTaskDto.id_user) {
        const validateName =
          await this.findOneTaskName(updateTaskDto.name);
        if (validateName["status"] !== 404) {
          return {message:'Task already exists', status: 409};
        }
        const validateUser =
          await this.userService.findOneById(updateTaskDto.id_user);
        if (validateUser["status"] === 404) {
          return validateUser;
        }
      }
      const response = await this.prisma.task.update({
        where: { id: id },
        data: updateTaskDto,
      });
      return response;
    } catch (error) {
      throw new Error('Error update Task');
    }
  }

  async remove(id: number) {
    try {
      const validateTask = await this.findOne(id);
      if (validateTask["status"] === 404) {
        return validateTask;
      }
      const response = await this.prisma.task.delete({
        where: { id: id },
      });
      return response;
    } catch (error) {
      throw new Error('Error delete Task');
    }
  }
}
