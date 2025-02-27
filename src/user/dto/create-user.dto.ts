import {  IsEnum, IsString} from 'class-validator';
import { Role } from '@prisma/client';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  /**
   * @example "John"
   */
  @IsString()
  name: string;

  /**
   * @example "Smith"
   */
  @IsString()
  username: string;

  /**
   * @example "000-000-000"
   */
  @IsString()
  dni: string;

  /**
   * @example "3222###"
   */
  @IsString()
  phone: string;

  /**
   * @example "password"
   */
  @IsString()
  password: string;

  /**
   * @example "occupation"
   */
  @IsString()
  occupation: string;

  /**
   * @example "Rol"
   */
  @IsEnum(Role,{
    message: `role debe ser uno de los siguientes valores: ${Object.values(Role).join(', ')}`
  })
  @Transform(({ value }) => value.toUpperCase())
  role: Role;
}
