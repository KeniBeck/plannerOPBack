import { Injectable } from '@nestjs/common';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { UpdateWorkerDto } from './dto/update-worker.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WorkerService {
  constructor(private prisma: PrismaService) {}
  create(createWorkerDto: CreateWorkerDto) {
    try {
      const validateworker = this.findOneById(createWorkerDto.dni);
      if (validateworker != 'Worker not found') {
        return 'Worker already exists';
      }

      const response = this.prisma.worker.create({
        data: createWorkerDto,
      });

      return response;
    } catch (error) {
      throw new Error(error);
    }
  }

  findAll() {
    try {
      const response = this.prisma.worker.findMany();
      return response;
    } catch (error) {
      throw new Error(error);
    };
  }

  findOne(id: number) {
    try {
      const response = this.prisma.worker.findUnique({
        where: { id },
      });
      if (!response) {
        return 'Worker not found';
      }
      return response;
    } catch (error) {
      throw new Error(error);
    }
  }

  findOneById(dni: string) {
    try {
      const response = this.prisma.worker.findUnique({
        where: { dni },
      });
      if (!response) {
        return 'Worker not found';
      }
      return response;
    } catch (error) {
      throw new Error(error);
    }
  }

  update(id: number, updateWorkerDto: UpdateWorkerDto) {
   try {
    const response = this.prisma.worker.update({
      where: {id},
      data: updateWorkerDto
    });
    return response;
   } catch (error) {
    throw new Error(error);
   }
  }

  remove(id: number) {
   try {
     const response = this.prisma.worker.delete({
      where:{id}
     });
      return response;
   } catch (error) {
    throw new Error(error);
   }
  }
}
