import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateOperationDto } from './create-operation.dto';
import { IsString, Matches } from 'class-validator';

export class UpdateOperationDto extends PartialType(CreateOperationDto) {
  @ApiProperty({ example: '2021-09-01' })
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'dateEnd debe tener formato YYYY-MM-DD',
  })
  dateEnd: string;

  @ApiProperty({example: "17:00"})
  @IsString()
  @Matches(/^([01]?[0-9]|2[0-3]):([0-5][0-9])$/, {
    message: 'timeEnd debe tener formato HH:MM'
  })
  timeEnd: string;
  
}
