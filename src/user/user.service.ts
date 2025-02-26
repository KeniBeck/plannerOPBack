import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { response } from 'express';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async create(createUserDto: CreateUserDto) {
    try {
      const validationUser = await this.findOne(createUserDto.dni);
      const userByUsername = await this.prisma.user.findUnique({
        where:{
          username: createUserDto.username
        }
      });
      if (validationUser != 'User not found' || userByUsername != null) {
        return 'User already exists';
      }
      const response = await this.prisma.user.create({
        data: createUserDto,
      });
      return response;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAll() {
    try {
      const response = await this.prisma.user.findMany();
      return response;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findOne(dni: string) {
    try {
      const response = await this.prisma.user.findUnique({
        where: {
          dni,
        },
      });
      if (!response) {
        return 'User not found';
      }
      return response;
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(dni: string, updateUserDto: UpdateUserDto) {
    try {
      const response = await this.prisma.user.update({
        where: {
          dni,
        },
        data: updateUserDto,
      })
      return response;
    } catch (error) {
      throw new Error(error);      
    }
  }

  async remove(dni: string) {
    try {
      const response = await this.prisma.user.delete({
        where: {
          dni,
        },
      })
      return response;
    } catch (error) {
      throw new Error(error);
      
    }
  }
}
