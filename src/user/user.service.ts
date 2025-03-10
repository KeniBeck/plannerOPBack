import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
/**
 * Servicio para gestionar usuarios
 * @class UserService
 */
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  /**
   * crea un usuario
   * @param createUserDto datos del usuario a crear
   * @returns respuesta de la creacion del usuario
   */
  async create(createUserDto: CreateUserDto) {
    try {
      const validationUser = await this.findOne(createUserDto.dni);
      const userByUsername = await this.findByUsername(createUserDto.username);
      if (validationUser["status"] != 404 || userByUsername != null) {
        return {message:'User already DNI exists', status: 409};
      }

      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const response = await this.prisma.user.create({
        data: { ...createUserDto, password: hashedPassword },
      });
      return response;
    } catch (error) {
      throw new Error(error);
    }
  }
  /**
   * obtene todos los usuarios
   * @returns respuesta de la busqueda de todos los usuarios
   */
  async findAll() {
    try {
      const response = await this.prisma.user.findMany();
      return response;
    } catch (error) {
      throw new Error(error);
    }
  }
  /**
   * obtener un usuario por su DNI
   * @param dni numero de identificacion del usuario a buscar
   * @returns respuesta de la busqueda del usuario
   */
  async findOne(dni: string) {
    try {
      const response = await this.prisma.user.findUnique({
        where: {
          dni,
        },
      });
      if (!response) {
        return {message:'User not found', status: 404};
      }
      return response;
    } catch (error) {
      throw new Error(error);
    }
  }
  /**
   * obtene un usuario por su ID
   * @param id id del usuario a buscar
   * @returns respuesta de la busqueda del usuario
   */
  async findOneById(id: number) {
    try {
      const response = await this.prisma.user.findUnique({
        where: { id },
      });
      if (!response) {
        return {message:'User not found', status: 404};
      }
      return response;
    } catch (error) {
      throw new Error(error);
    }
  }
  /**
   * actualiza un usuario
   * @param dni numero de identificacion del usuario a actualizar
   * @param updateUserDto datos del usuario a actualizar
   * @returns respuesta de la actualizacion del usuario
   */
  async update(dni: string, updateUserDto: UpdateUserDto) {
    try {
      const validateUser = await this.findOne(dni);
      if (validateUser["status"] === 404) {
        return validateUser;
      }

      const dataUpdate = { ...updateUserDto };
      if (dataUpdate.password) {
        dataUpdate.password = await bcrypt.hash(dataUpdate.password, 10);
      } else {
        delete dataUpdate.password;
      }
      const response = await this.prisma.user.update({
        where: {
          dni,
        },
        data: dataUpdate,
      });
      return response;
    } catch (error) {
      throw new Error(error);
    }
  }
  /**
   * eliminar un usuario
   * @param dni numero de identificacion del usuario a eliminar 
   * @returns respuesta de la eliminacion del usuario
   */
  async remove(dni: string) {
    try {
      const response = await this.prisma.user.delete({
        where: {
          dni,
        },
      });
      return response;
    } catch (error) {
      throw new Error(error);
    }
  }
  /**
   * obtene un usuario por su nombre de usuario
   * @param username username del usuario a buscar
   * @returns respuesta de la busqueda del usuario
   */
  async findByUsername(username: string) {
    try {
      const response = await this.prisma.user.findUnique({
        where: {
          username,
        },
      });
      return response;
    } catch (error) {
      throw new Error(error);
    }
  }
}
