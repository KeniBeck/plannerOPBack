import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, NotFoundException, UseGuards } from '@nestjs/common';
import { OperationService } from './operation.service';
import { CreateOperationDto } from './dto/create-operation.dto';
import { UpdateOperationDto } from './dto/update-operation.dto';
import { ParseIntPipe } from 'src/pipes/parse-int/parse-int.pipe';
import { DateTransformPipe } from 'src/pipes/date-transform/date-transform.pipe';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('operation')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class OperationController {
  constructor(private readonly operationService: OperationService) {}

  @Post()
  @UsePipes(new DateTransformPipe())
 async create(@Body() createOperationDto: CreateOperationDto) {
    const response = await this.operationService.create(createOperationDto);
    if (response === 'User not found') {
      throw new NotFoundException(response);
    }
    if (response === 'Area not found') {
      throw new NotFoundException(response);
    }
    if (response === 'Task not found') {
      throw new NotFoundException(response);
    }
    return response;
  }

  @Get()
 async findAll() {
    const response = await this.operationService.findAll();
    return response;
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const response = await this.operationService.findOne(id);
    if (response === 'Operation not found') {
      throw new NotFoundException(response);
    }
    return response;
  }

  @Patch(':id')
  @UsePipes(new DateTransformPipe())
 async update(@Param('id', ParseIntPipe) id: number, @Body() updateOperationDto: UpdateOperationDto) {
    const response = await this.operationService.update(id, updateOperationDto);
    if (response === 'Operation not found') {
      throw new NotFoundException(response);
    }
    if (response === 'User not found') {
      throw new NotFoundException(response);
    }
    return response;
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const response = await this.operationService.remove(id);
    if (response === 'Operation not found') {
      throw new NotFoundException(response);
    }
    return response;
  }
}
