import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class WorkerScheduleDto {
  @ApiProperty({
    description: 'ID único o array de IDs de trabajadores para esta programación',
    example: [1, 2, 3],
    type: [Number]
  })
  @IsArray()
  @IsNumber({}, { each: true })
  workerIds: number[]; // Cambiamos de id único a un array de IDs

  @ApiProperty({
    description: 'Fecha de inicio para estos trabajadores',
    example: '2023-10-01',
    required: false
  })
  @IsOptional()
  @IsString()
  dateStart?: string;

  @ApiProperty({
    description: 'Fecha de fin para estos trabajadores',
    example: '2023-10-31',
    required: false
  })
  @IsOptional()
  @IsString()
  dateEnd?: string;

  @ApiProperty({
    description: 'Hora de inicio para estos trabajadores',
    example: '08:00',
    required: false
  })
  @IsOptional()
  @IsString()
  timeStart?: string;

  @ApiProperty({
    description: 'Hora de fin para estos trabajadores',
    example: '17:00',
    required: false
  })
  @IsOptional()
  @IsString()
  timeEnd?: string;
}