import {  IsEnum, IsNumber, IsOptional, IsString, Matches } from 'class-validator';
import { Status } from '@prisma/client';
import { Type } from 'class-transformer';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';


export class CreateWorkerDto {
  @ApiProperty({ example: '000-000-000' })
  @IsString()
  dni: string;

  @ApiProperty({ example: 'HGT7895' })
  @IsString()
  code: string;

  @ApiProperty({ example: '3222###' })
  @IsString()
  phone: string;

  @ApiProperty({example:"5"})
  @Type(() => Number)
  @IsNumber()
  hoursWorked: number;

  @ApiProperty({example:"3"})
  @Type(() => Number)
  @IsNumber()
  failures: number;

  @ApiProperty({ example: 'John' })
  @IsString()
  name: string;

  @ApiProperty({ example: `${Object.values(Status).join(', ')}` })
  @IsEnum(Status, {
    message: `status debe ser uno de los siguientes valores: ${Object.values(Status).join(', ')}`,
  })
  status: Status;

  @ApiProperty({ example: '12' })
  @IsNumber()
  @Type(() => Number)
  id_area: number;

  @ApiHideProperty()
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  id_user?: number;

  @ApiProperty({ example: '2021-09-01' })
  @IsString()
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'dateDisableStart debe tener formato YYYY-MM-DD',
  })
  dateDisableStart: string;

  @ApiProperty({ example: '2021-10-01' })
  @IsString()
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'dateDisableEnd debe tener formato YYYY-MM-DD',
  })
  dateDisableEnd: string;

  @ApiProperty({ example: '2021-10-01' })
  @IsString()
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'dateRetierment debe tener formato YYYY-MM-DD',
  })
  dateRetierment: string;
}
