import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UsePipes,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ToLowerCasePipe } from 'src/pipes/to-lowercase/to-lowercase.pipe';
import { ParseIntPipe } from 'src/pipes/parse-int/parse-int.pipe';

@Controller('task')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @UsePipes(new ToLowerCasePipe())
  async create(@Body() createTaskDto: CreateTaskDto) {
    const response = await this.taskService.create(createTaskDto);
    if (response == 'User not found') {
      throw new NotFoundException('User not found');
    }
    if (response == 'Task already exists') {
      throw new ConflictException('Task already exists');
    }

    return response;
  }

  @Get()
  findAll() {
    return this.taskService.findAll();
  }
  @Get(':name')
  async findByName(@Param('name') name: string) {
    const response = await this.taskService.findOneTaskName(name);
    if (response == 'Task not found') {
      throw new NotFoundException(response);
    }
    return response;
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.taskService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    const response = await this.taskService.update(id, updateTaskDto);
    if (response == 'Task not found') {
      throw new NotFoundException(response);
    }
    if (response === 'Task already exists') {
      throw new NotFoundException(response);
    }
    if (response === 'User not found') {
      throw new NotFoundException(response);
    }
    return response;
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const response = await this.taskService.remove(id);
    if (response == 'Task not found') {
      throw new NotFoundException(response);
    }
    return response;
  }
}
