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
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Controller('task')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @UsePipes(new ToLowerCasePipe())
  async create(@Body() createTaskDto: CreateTaskDto, @CurrentUser("userId") userId: number) {
    createTaskDto.id_user = userId;
    const response = await this.taskService.create(createTaskDto);
    if (response['status'] === 404) {
      throw new NotFoundException(response["message"]);
    }
    if (response["status"] === 409) {
      throw new ConflictException(response["message"]);
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
    if (response["status"] === 404) {
      throw new NotFoundException(response["message"]);
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
    @CurrentUser("userId") userId: number,
  ) {
    updateTaskDto.id_user = userId;
    const response = await this.taskService.update(id, updateTaskDto);
    if (response["status"] === 404) {
      throw new NotFoundException(response["message"]);
    }
   
    return response;
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const response = await this.taskService.remove(id);
    if (response["status"] === 404) {
      throw new NotFoundException(response["message"]);
    }
    return response;
  }
}
