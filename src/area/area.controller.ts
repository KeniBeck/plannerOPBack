import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { AreaService } from './area.service';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { ParseIntPipe } from 'src/pipes/parse-int/parse-int.pipe';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import {ApiBearerAuth} from '@nestjs/swagger';

@Controller('area')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class AreaController {
  constructor(private readonly areaService: AreaService) {}

  @Post()
  async create(@Body() createAreaDto: CreateAreaDto) {
    const response = await this.areaService.create(createAreaDto);
    if (response["status"] === 404) {
      throw new NotFoundException(response["message"]);
    }
    return response;
  }

  @Get()
  findAll() {
    return this.areaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.areaService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateAreaDto: UpdateAreaDto) {
    return this.areaService.update(id, updateAreaDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.areaService.remove(id);
  }
}
