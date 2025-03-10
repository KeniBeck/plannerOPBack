import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ParseIntPipe } from 'src/pipes/parse-int/parse-int.pipe';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('client')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  async create(@Body() createClientDto: CreateClientDto) {
    const response = await this.clientService.create(createClientDto);
    if (response["status"] === 404) {
      return { message: response["message"], status: 404 };
    };
    return response;
  }

  @Get()
  async findAll() {
    const response = await this.clientService.findAll();
    return response;
  }

  @Get(':id')
 async findOne(@Param('id', ParseIntPipe) id: number) {
    const response = await this.clientService.findOne(id);
    if (response["status"] === 404) {
      return { message: response["message"], status: 404 };
    };
    return response;
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateClientDto: UpdateClientDto) {
    const response = await this.clientService.update(id, updateClientDto);
    if (response["status"] === 404) {
      return { message: response["message"], status: 404 };
    };
    return response;
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const response = await this.clientService.remove(id);
    if (response["status"] === 404) {
      return { message: response["message"], status: 404 };
    };
    return response;
  }
}
