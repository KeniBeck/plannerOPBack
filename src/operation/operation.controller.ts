import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  NotFoundException,
  UseGuards,
  Query,
} from '@nestjs/common';
import { OperationService } from './operation.service';
import { CreateOperationDto } from './dto/create-operation.dto';
import { UpdateOperationDto } from './dto/update-operation.dto';
import { ParseIntPipe } from 'src/pipes/parse-int/parse-int.pipe';
import { DateTransformPipe } from 'src/pipes/date-transform/date-transform.pipe';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Controller('operation')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class OperationController {
  constructor(private readonly operationService: OperationService) {}

  @Post()
  @UsePipes(new DateTransformPipe())
  async create(@Body() createOperationDto: CreateOperationDto, @CurrentUser("userId") userId: number) {
    createOperationDto.id_user = userId;
    console.log(createOperationDto);
        const response = await this.operationService.createWithWorkers(createOperationDto);
    if (response["status"] === 404) {
      throw new NotFoundException(response["message"]);
    }
    return response;
  }

  @Get()
  async findAll() {
    const response = await this.operationService.findAll();
    return response;
  }

  @Get('by-status')
  async findByStatus(){
    const response = await this.operationService.findActiveOperations();
    if (response["status"] === 404) {
      throw new NotFoundException(response["message"]);
    }  
    return response;
  }

  @Get('by-date')
  async findByDate(
    @Query('dateStart', DateTransformPipe) dateStart: Date, 
    @Query('dateEnd', DateTransformPipe) dateEnd: Date
  ) {
    const response = await this.operationService.findOperationRangeDate(dateStart, dateEnd);
    if (response["status"] === 404) {
      throw new NotFoundException(response["message"]);
    }
    return response;
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const response = await this.operationService.findOne(id);
    if (response["status"] === 404) {
      throw new NotFoundException(response["message"]);
    }
    return response;
  }

  @Patch(':id')
  @UsePipes(new DateTransformPipe())
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOperationDto: UpdateOperationDto,
  ) {
  
    const response = await this.operationService.update(id, updateOperationDto);
    if (response && response["status"] === 404) {
      throw new NotFoundException(response["messsge"]);
    }
    return response;
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const response = await this.operationService.remove(id);
    if (response["status"] === 404) {
      throw new NotFoundException(response["message"]);
    }
    return response;
  }
}
