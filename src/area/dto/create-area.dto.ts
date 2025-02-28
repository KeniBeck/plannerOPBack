import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsString } from 'class-validator';

export class CreateAreaDto {
  @ApiProperty({ example: '1' })
  @Type(() => Number)
  @IsNumber()
  id_user: number;
  @ApiProperty({ example: 'Area 1' })
  @IsString()
  name: string;
}
