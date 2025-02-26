import { Injectable } from '@nestjs/common';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import e from 'express';

@Injectable()
export class AreaService {
  constructor(private prisma: PrismaService){}
  async create(createAreaDto: CreateAreaDto) {
    try {
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
      const response = this.prisma.jobArea.findUnique({
        where:{
          id
        }
      });
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
