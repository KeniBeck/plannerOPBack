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
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from '@prisma/client';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('user')
@ApiBearerAuth('access-token')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  async create(@Request() req, @Body() createUserDto: CreateUserDto) {
    const currentUserRole = req.user.role;
    const newUserRole = createUserDto.role;
    if (currentUserRole === Role.ADMIN && newUserRole === Role.SUPERADMIN) {
      throw new ForbiddenException('Admins cannot create superadmin accounts');
    }

    const response = await this.userService.create(createUserDto);
    if (response["status"] === 409) {
      throw new ConflictException(response["message"]);
    }
    return response;
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.userService.findAll();
  }

  @Get(':dni')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('dni') dni: string) {
    const response = await this.userService.findOne(dni);
    if (response["status"] === 404) {
      throw new NotFoundException(response["message"]);
    }
    return response;
  }

  @Patch(':dni')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  async update(
    @Request() req,
    @Param('dni') dni: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const userToUpdate = await this.userService.findOne(dni);
    const currentUserRole = req.user.role;
    if (userToUpdate["status"] === 404) {
      throw new NotFoundException(userToUpdate["message"]);
    }

    if (
      'role' in userToUpdate &&
      currentUserRole === Role.ADMIN &&
      userToUpdate.role === Role.SUPERADMIN
    ) {
      throw new ForbiddenException(
        'Admins cannot update to superadmin accounts',
      );
    }
    const response = await this.userService.update(dni, updateUserDto);
    if (response["status"] === 404) {
      throw new NotFoundException(response["message"]);
    }
    return response;
  }

  @Delete(':dni')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  async remove(@Request() req, @Param('dni') dni: string) {
    const userToDelete = await this.userService.findOne(dni);

    if (userToDelete["status"] === 404) {
      throw new NotFoundException(userToDelete["message"]);
    }
    const currentUserRole = req.user.role;
    if (
      currentUserRole === Role.ADMIN &&
      'role' in userToDelete &&
      userToDelete.role === Role.SUPERADMIN
    ) {
      throw new ForbiddenException('Admins cannot delete superadmin accounts');
    }

    const response = await this.userService.remove(dni);
    return response;
  }
}
