import { Injectable } from '@nestjs/common';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { UpdateWorkerDto } from './dto/update-worker.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AreaService } from 'src/area/area.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class WorkerService {
  constructor(
    private prisma: PrismaService,
    private areaService: AreaService,
    private userService: UserService,
  ) {}
  async create(createWorkerDto: CreateWorkerDto) {
    try {
      const id_user = createWorkerDto.id_user;
      const id_area = createWorkerDto.id_area;
      const dni = createWorkerDto.dni;
      const phone = createWorkerDto.phone;

      const validateworker = await this.findOneById(dni) != 'Worker not found';
      if (validateworker) {return 'Worker already exists'};
      
      const validateArea = await this.areaService.findOne(id_area) != 'Area not found';
      if (!validateArea ) {return 'Area not found'};
     
      
      const validateUser = await this.userService.findOneById(id_user) != 'User not found';
      if (!validateUser)  {return 'User not found'};

      const validatePhone = await this.findUniquePhone(phone) != 'Phone not found';
      if (validatePhone) {return 'Phone already exists'};
      
      const response = await this.prisma.worker.create({
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
    }
  }

 async findUniquePhone(phone: string) {
    try {
      const response = await this.prisma.worker.findUnique({
        where: { phone },
      });
      if (!response) {
        return 'Phone not found';
      }
      return response;
    } catch (error) {
      throw new Error(error);
    }

  }

  async findOne(id: number) {
    try {
      const response = await this.prisma.worker.findUnique({
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

  async findOneById(dni: string) {
    try {
      const response = await this.prisma.worker.findUnique({
        where: { dni },
      });
      if (!response) {
        return 'Worker not found';
      }
      console.log(response);
      return response;
    } catch (error) {
      throw new Error(error);
    }
  }

 async update(id: number, updateWorkerDto: UpdateWorkerDto) {
    try {
      const validateWorker = await this.findOne(id) != 'Worker not found';
      if (!validateWorker) {return 'Worker not found'};
      const response = await this.prisma.worker.update({
        where: { id },
        data: updateWorkerDto,
      });
      return response;
    } catch (error) {
      throw new Error(error);
    }
  }

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
