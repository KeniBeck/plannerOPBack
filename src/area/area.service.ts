import { Injectable } from '@nestjs/common';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import e from 'express';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AreaService {
  constructor(private prisma: PrismaService, private userService: UserService){}
  async create(createAreaDto: CreateAreaDto) {
    try {
      const userId = Number(createAreaDto.id_user);
      const user = await this.userService.findOneById(userId);
      if (!user) {
        return 'User not found';
      }
      const response = await this.prisma.jobArea.create({
        data: createAreaDto,
      });
      return response;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAll() {
    try {
      const response = await this.prisma.jobArea.findMany();
      return response;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findOne(id: number) {
    try {
      const response = await this.prisma.jobArea.findUnique({
        where:{
          id
        }
      });
      if (!response) {
        return 'Area not found';
      }
      return response;
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(id: number, updateAreaDto: UpdateAreaDto) {
    try {
      const response = await this.prisma.jobArea.update({
        where:{
          id
        },
        data: updateAreaDto
      });
      return response;
    } catch (error) {
      throw new Error(error);
    }
  }

  async remove(id: number) {
    try {
      const response = await this.prisma.jobArea.delete({
        where: {
          id
        }
      })
      return response;
    } catch (error) {
      throw new Error(error);
    }
  }
}
