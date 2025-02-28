import {  IsEnum, IsString} from 'class-validator';
import { Role } from '@prisma/client';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'john' })
  @IsString()
  username: string;

  @ApiProperty({ example: '000-000-000' })
  @IsString()
  dni: string;

  @ApiProperty({ example: '3222###' })
  @IsString()
  phone: string;

  @ApiProperty({ example: '******' })
  @IsString()
  password: string;

  @ApiProperty({ example: 'Developer' })
  @IsString()
  occupation: string;

  @ApiProperty({ example: `${Object.values(Role).join(', ')}` })
  @IsEnum(Role,{
    message: `role debe ser uno de los siguientes valores: ${Object.values(Role).join(', ')}`
  })
  @Transform(({ value }) => value.toUpperCase())
  role: Role;
}
