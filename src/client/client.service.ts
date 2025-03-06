import { Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ClientService {
  constructor(private prisma: PrismaService) {}
  async create(createClientDto: CreateClientDto) {
    try {
      const {id_user} = createClientDto;
      const response = await this.prisma.client.create({
        data:createClientDto
      });
      return response;
    } catch (error) {
      throw new Error(`Error: ${error.message}`)
    }
  }

 async findAll() {
    try {
      const response = await this.prisma.client.findMany();

      return response;
    } catch (error) {
      throw new Error(`Error: ${error.message}`)
    }
  }

 async findOne(id: number) {
    try {
      const response = await this.prisma.client.findUnique({
        where:{
          id:id
        }
      });
      if(!response){
        return{message:"Client not found", status:404}
      }
      return response;
    } catch (error) {
      throw new Error(`Error: ${error.message}`)
    }
  }

 async update(id: number, updateClientDto: UpdateClientDto) {
    try {
      const validateClient = await this.findOne(id);
      if(validateClient["status"] === 404){
        return validateClient;
      };
      const response = await this.prisma.client.update({
        where:{
          id:id
        },
        data:updateClientDto
      });
      return response;
    } catch (error) {
      throw new Error(`Error: ${error.message}`)
    }
  }

 async remove(id: number) {
    try {
      const validateClient = await this.findOne(id);
      if(validateClient["status"] === 404){
        return validateClient;
      }
      const response = await this.prisma.client.delete({
        where:{id:id}
      });
      return response;
    } catch (error) {
      throw new Error(`Error: ${error.message}`)
    }
  }
}
