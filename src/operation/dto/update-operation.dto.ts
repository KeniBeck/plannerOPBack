import { PartialType, OmitType, ApiProperty } from '@nestjs/swagger';
import { CreateOperationDto } from './create-operation.dto';
import { IsArray, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

// Omitimos los campos de relación del DTO base
class OperationUpdateBaseDto extends OmitType(CreateOperationDto, [
  'id_user',
  'id_area',
  'id_task', 
  'id_client',
  'workerIds'
] as const) {}

// Hacemos los campos restantes opcionales
export class UpdateOperationDto extends PartialType(OperationUpdateBaseDto) {

  
  // Si aún necesitas actualizar workers, usa un formato que Prisma pueda entender
  @ApiProperty({ 
    type: Object, 
    required: false,
    example: { 
      connect: [{ id: 1 }, { id: 2 }],
      disconnect: [{ id: 3 }]
    } 
  })
  @IsOptional()
  workers?: {
    connect?: { id: number }[];
    disconnect?: { id: number }[];
  };
}