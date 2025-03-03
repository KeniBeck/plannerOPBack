import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateOperationDto } from './create-operation.dto';
import { IsString, Matches } from 'class-validator';

export class UpdateOperationDto extends PartialType(CreateOperationDto) {
}
