import { Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { PrismaService } from 'src/prisma/prisma.service';
/**
 * Servicio para gestionar clientes
 * @class ClientService
 */
@Injectable()
export class ClientService {
  constructor(private prisma: PrismaService) {}
  /**
   * Crear un cliente
   * @param createClientDto datos del cliente a crear
   * @returns respuesta de la creacion del cliente
   */
  async create(createClientDto: CreateClientDto) {
    try {
      if (createClientDto.id_user === undefined) {
        return { message: 'User ID is required', status: 400 };
      }
      const response = await this.prisma.client.create({
        data: { ...createClientDto, id_user: createClientDto.id_user },
      });
      return response;
    } catch (error) {
      throw new Error(`Error: ${error.message}`);
    }
  }
  /**
   * Devuelve todos los clientes
   * @returns retorna todos los clientes
   */
  async findAll() {
    try {
      const response = await this.prisma.client.findMany();

      return response;
    } catch (error) {
      throw new Error(`Error: ${error.message}`);
    }
  }
  /**
   * obtiene un cliente por su ID
   * @param id id del cliente a buscar
   * @returns respuesta de la busqueda del cliente
   */
  async findOne(id: number) {
    try {
      const response = await this.prisma.client.findUnique({
        where: {
          id: id,
        },
      });
      if (!response) {
        return { message: 'Client not found', status: 404 };
      }
      return response;
    } catch (error) {
      throw new Error(`Error: ${error.message}`);
    }
  }
  /**
   * Actualiza un cliente
   * @param id id del cliente a actualizar
   * @param updateClientDto datos del cliente a actualizar
   * @returns respuesta de la actualizacion del cliente
   */
  async update(id: number, updateClientDto: UpdateClientDto) {
    try {
      const validateClient = await this.findOne(id);
      if (validateClient['status'] === 404) {
        return validateClient;
      }
      const response = await this.prisma.client.update({
        where: {
          id: id,
        },
        data: updateClientDto,
      });
      return response;
    } catch (error) {
      throw new Error(`Error: ${error.message}`);
    }
  }
  /**
   * Elimina un cliente
   * @param id id del cliente a eliminar
   * @returns respuesta de la eliminacion del cliente
   */
  async remove(id: number) {
    try {
      const validateClient = await this.findOne(id);
      if (validateClient['status'] === 404) {
        return validateClient;
      }
      const response = await this.prisma.client.delete({
        where: { id: id },
      });
      return response;
    } catch (error) {
      throw new Error(`Error: ${error.message}`);
    }
  }
}
