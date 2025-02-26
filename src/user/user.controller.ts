import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const response = await this.userService.create(createUserDto);
    if (response == 'User already exists') {
      throw new ConflictException(response);
    }
    return response;
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':dni')
  async findOne(@Param('dni') dni: string) {
    const response = await this.userService.findOne(dni);
    if (response == 'User not found') {
      throw new NotFoundException(response);
    }
    return response;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
