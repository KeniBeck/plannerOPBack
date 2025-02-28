import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';

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
        (await this.userService.findOneById(id_user)) != 'User not found';

      if (!validateUser) {
        return 'User not found';
      }

      const validateTask =
        (await this.findOneTaskName(name)) != 'Task not found';
      console.log(validateTask, name);
      if (validateTask) {
        return 'Task already exists';
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
        return 'Task not found';
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
        return 'Task not found';
      }
      return response;
    } catch (error) {
      throw new Error('Error get Task');
    }
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    try {
      const validateTask = (await this.findOne(id)) != 'Task not found';
      if (!validateTask) {
        return 'Task not found';
      }

      if (updateTaskDto.name && updateTaskDto.id_user) {
        const validateName =
          (await this.findOneTaskName(updateTaskDto.name)) != 'Task not found';
        if (validateName) {
          return 'Task already exists';
        }
        const validateUser =
          (await this.userService.findOneById(updateTaskDto.id_user)) !=
          'User not found';
        if (!validateUser) {
          return 'User not found';
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
      const validateTask = (await this.findOne(id)) != 'Task not found';
      if (!validateTask) {
        return 'Task not found';
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
