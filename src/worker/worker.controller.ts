import { Controller, Get, Post, Body, Patch, Param, Delete, ConflictException, NotFoundException } from '@nestjs/common';
import { WorkerService } from './worker.service';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { UpdateWorkerDto } from './dto/update-worker.dto';
import { ParseIntPipe } from 'src/pipes/parse-int/parse-int.pipe';


@Controller('worker')
export class WorkerController {
  constructor(private readonly workerService: WorkerService) {}

  @Post()
  async create(@Body() createWorkerDto: CreateWorkerDto) {
    const response = await this.workerService.create(createWorkerDto);
    if (response == 'Worker already exists' || response == 'Area not found' || response == 'User not found') {
      throw new ConflictException(response);
    }
    if (response == 'Phone already exists') {
      throw new ConflictException(response);
    }
    return response;
  }

  @Get()
  findAll() {
    return this.workerService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const response = await this.workerService.findOne(id);
    if (response == 'Worker not found') {
      throw new NotFoundException(response);
    }
    return response;
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateWorkerDto: UpdateWorkerDto) {
    const response = await this.workerService.update(id, updateWorkerDto);
    if (response == 'Worker not found') {
      throw new NotFoundException(response);
    }
    return response;
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.workerService.remove(id);
  }
}
