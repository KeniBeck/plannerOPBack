import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ConflictException,
  NotFoundException,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { WorkerService } from './worker.service';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { UpdateWorkerDto } from './dto/update-worker.dto';
import { ParseIntPipe } from 'src/pipes/parse-int/parse-int.pipe';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { DateTransformPipe } from 'src/pipes/date-transform/date-transform.pipe';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

/**
 * @category Controller
 */
@Controller('worker')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class WorkerController {
  constructor(private readonly workerService: WorkerService) {}

  @Post()
  @UsePipes(new DateTransformPipe())

  async create(@Body() createWorkerDto: CreateWorkerDto, @CurrentUser("userId") userId: number) {
    createWorkerDto.id_user = userId;
    const response = await this.workerService.create(createWorkerDto);
    if (response['status'] === 409) {
      throw new ConflictException(response["message"]);
    }
    if (response["status"] === 404) {
      throw new NotFoundException(response["message"]);
    }
    return response;
  }



  @Get()
  findAll() {
    return this.workerService.findAll();
  }

  @Get(':dni')
  async findDni(@Param('dni')dni:string){
    const response = await this.workerService.finDni(dni);
    if (response["status"] === 404) {
      throw new NotFoundException(response["message"]);
    }
    return response;
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const response = await this.workerService.findOne(id);
    if (response["status"] === 404) {
      throw new NotFoundException(response["message"]);
    }
    return response;
  }

  @Patch(':id')
  @UsePipes(new DateTransformPipe())
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWorkerDto: UpdateWorkerDto,
  ) {
    const response = await this.workerService.update(id, updateWorkerDto);
    if (response["status"] === 404) {
      throw new NotFoundException(response["message"]);
    }
    return response;
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.workerService.remove(id);
  }
}
