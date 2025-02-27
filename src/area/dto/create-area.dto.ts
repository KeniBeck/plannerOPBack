import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsString } from 'class-validator';

export class CreateAreaDto {
  /**
   * @example "id de usurio que crea el area"
   */
    @Type(() => Number)
    @IsNumber()
    id_user: number;

  /**
   * @example "Area de trabajo"
   */
  @IsString()
  name: string;
}
