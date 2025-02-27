import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async create(createUserDto: CreateUserDto) {
    try {
      const validationUser = await this.findOne(createUserDto.dni);
      const userByUsername = await this.findByUsername(createUserDto.username);
      if (validationUser != 'User not found' || userByUsername != null) {
        return 'User already exists';
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

  async findOneById(id: number) {
    try {
      const response = await this.prisma.user.findUnique({
        where: { id },
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
      const validateUser = await this.findOne(dni);
      if (validateUser == 'User not found') {
        return 'User not found';
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
