import { Injectable } from '@nestjs/common';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { UpdateWorkerDto } from './dto/update-worker.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AreaService } from 'src/area/area.service';
import { UserService } from 'src/user/user.service';
/**
 * Servicio para gestionar trabajadores
 * @class workerService
 */
@Injectable()
export class WorkerService {
  constructor(
    private prisma: PrismaService,
    private areaService: AreaService,
    private userService: UserService,
  ) {}
  /**
   * craer un trabajador
   * @param createWorkerDto datos del trabajador a crear 
   * @returns respuesta de la creacion del trabajador
   */
  async create(createWorkerDto: CreateWorkerDto) {
    try {
      const { dni, id_area, id_user, phone, code } = createWorkerDto;

      const validateWorkerCode = await this.findUniqueCode(code);
      if (validateWorkerCode['status'] !== 404) {
        return { message: 'Code already exists', status: 409 };
      }
      const validateworker = await this.findOneById(dni);
      if (validateworker['status'] !== 404) {
        return { message: 'Worker already exists', status: 409 };
      }

      const validateArea = await this.areaService.findOne(id_area);
      if (validateArea['status'] === 404) {
        return validateArea;
      }

      const validateUser = await this.userService.findOneById(id_user);
      if (validateUser['status'] === 404) {
        return validateUser;
      }

      const validatePhone = await this.findUniquePhone(phone);
      if (validatePhone['status'] !== 404) {
        return { message: 'Phone already exists', status: 409 };
      }

      const response = await this.prisma.worker.create({
        data: createWorkerDto,
      });

      return response;
    } catch (error) {
      throw new Error(error);
    }
  }
  /**
   * obtener todos los trabajadores
   * @returns resupuesta de la busqueda de todos los trabajadores
   */
  async findAll() {
    try {
      const response = await this.prisma.worker.findMany({
        include: {
          jobArea: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
      const transformResponse = response.map((res) => {
        const { id_area, ...rest } = res;
        return rest;
      });
      return transformResponse;
    } catch (error) {
      throw new Error(error);
    }
  }
  /**
   * obtener un trabajador por su codigo
   * @param code codigo del trabajador a buscar
   * @returns respuesta de la busqueda del trabajador
   */
  async findUniqueCode(code: string) {
    try {
      const response = await this.prisma.worker.findUnique({
        where: { code },
      });
      if (!response) {
        return { message: 'Code not found', status: 404 };
      }
      return response;
    } catch (error) {
      throw new Error(error);
    }
  }
  /**
   * obtener un trabajador por su telefono
   * @param phone telefono del trabajador a buscar
   * @returns respuesta de la busqueda del trabajador
   */
  async findUniquePhone(phone: string) {
    try {
      const response = await this.prisma.worker.findUnique({
        where: { phone },
      });
      if (!response) {
        return { message: 'Phone not found', status: 404 };
      }
      return response;
    } catch (error) {
      throw new Error(error);
    }
  }
  /**
   * obtener un trabajador por su ID
   * @param id id del trabajador a buscar
   * @returns resupuesta de la busqueda del trabajador
   */
  async findOne(id: number) {
    try {
      const response = await this.prisma.worker.findUnique({
        where: { id },
        include: {
          jobArea: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (!response) {
        return { message: 'Worker not found', status: 404 };
      }

      const { id_area, ...rest } = response;
      return rest;
    } catch (error) {
      throw new Error(error);
    }
  }
  /**
   * obtener un trabajador por su DNI
   * @param dni numero de identificacion del trabajador a buscar
   * @returns respuesta de la busqueda del trabajador
   */
  async findOneById(dni: string) {
    try {
      const response = await this.prisma.worker.findUnique({
        where: { dni },
      });
      if (!response) {
        return { message: 'Worker not found', status: 404 };
      }
      return response;
    } catch (error) {
      throw new Error(error);
    }
  }
  /**
   * actualizar un trabajador
   * @param id id del trabajador a actualizar
   * @param updateWorkerDto datos del trabajador a actualizar
   * @returns respuesta de la actualizacion del trabajador
   */
  async update(id: number, updateWorkerDto: UpdateWorkerDto) {
    try {
      const validateWorker = await this.findOne(id);
      if (validateWorker['status'] === 404) {
        return { message: 'Worker not found', status: 404 };
      }
      const response = await this.prisma.worker.update({
        where: { id },
        data: updateWorkerDto,
      });
      return response;
    } catch (error) {
      throw new Error(error);
    }
  }
  /**
   * eliminar un trabajador
   * @param id id del trabajador a eliminar
   * @returns respuesta de la eliminacion del trabajador
   */
  async remove(id: number) {
    try {
      const response = await this.prisma.worker.delete({
        where: { id },
      });
      return response;
    } catch (error) {
      throw new Error(error);
    }
  }
}
