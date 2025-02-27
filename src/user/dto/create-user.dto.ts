import { IsEmail, IsString} from 'class-validator';
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
  @IsEmail()
  phone: string;

  /**
   * @example "password"
   */
  @IsString()
  password: string;

  /**
   * @example "id_area"
   */
  @IsString()
  id_area: number;

  /**
   * @example "Rol"
   */
  @IsString()
  @Transform(({ value }) => value.toUpperCase())
  role: Role;
}
