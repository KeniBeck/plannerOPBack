import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
/**
 * Servicio para gestionar tareas
 * @class TaskService
 */
@Injectable()
export class TaskService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}
  /**
   * crear una tarea
   * @param createTaskDto datos de la tarea a crear 
   * @returns respuesta de la creacion de la tarea
   */
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
  /**
   * obtener una tarea por su nombre
   * @param name nombre de la tarea a buscar
   * @returns respuesta de la busqueda de la tarea
   */
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
  /**
   * obtener todas las tareas
   * @returns respuesta de la busqueda de todas las tareas
   */
  async findAll() {
    try {
      const response = await this.prisma.task.findMany();
      return response;
    } catch (error) {
      throw new Error('Error get all Task');
    }
  }
  /**
   * obtener una tarea por su ID
   * @param id id de la tarea a buscar
   * @returns respuesta de la busqueda de la tarea
   */
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
  /**
   * actualizar una tarea
   * @param id id  de la tarea a actualizar
   * @param updateTaskDto datos de la tarea a actualizar
   * @returns respuesta de la actualizacion de la tarea
   */
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
  /**
   * eliminar una tarea
   * @param id tarea a eliminar
   * @returns respuesta de la eliminacion de la tarea
   */
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
