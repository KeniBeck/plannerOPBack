import { ApiHideProperty, ApiProperty } from "@nestjs/swagger"
import {  StatusOperation } from "@prisma/client"
import { Type } from "class-transformer"
import { IsArray, IsEnum, IsNumber, IsOptional, IsString, Matches } from "class-validator"

export class CreateOperationDto {

    @ApiProperty({example:`${Object.values(StatusOperation).join(', ')}` })
    @IsEnum(StatusOperation, {
        message: `status debe ser uno de los siguientes valores: ${Object.values(StatusOperation).join(', ')}`
    })
    status :StatusOperation

    @ApiProperty({example: "23"})
    @Type (() => Number)
    @IsNumber()
    zone: number

    @ApiProperty({example: "HTR4567"})
    @IsString()
    motorShip: string

    @ApiProperty({example: "2021-09-01"})
    @IsString()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
      message: 'dateStart debe tener formato YYYY-MM-DD'
    })
    dateStart: string;

    @ApiProperty({example: "08:00"})
    @IsString()
    @Matches(/^([01]?[0-9]|2[0-3]):([0-5][0-9])$/, {
      message: 'timeStrat debe tener formato HH:MM'
    })
    timeStrat: string;

    @ApiProperty({ example: '2021-09-01' })
    @IsString()
    @IsOptional()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
      message: 'dateEnd debe tener formato YYYY-MM-DD',
    })
    dateEnd: string;
  
    @ApiProperty({example: "17:00"})
    @IsString()
    @IsOptional()
    @Matches(/^([01]?[0-9]|2[0-3]):([0-5][0-9])$/, {
      message: 'timeEnd debe tener formato HH:MM'
    })
    timeEnd: string;

    @ApiHideProperty()
    @Type (() => Number)
    @IsNumber()
    @IsOptional()
    id_user?: number
    
    @ApiProperty({example: "1"})
    @Type (() => Number)
    @IsNumber()
    id_area: number

    @ApiProperty({example: "1"})
    @Type (() => Number)
    @IsNumber()
    id_task: number

    @ApiProperty({example: "1"})
    @Type (() => Number)
    @IsNumber()
    id_client: number

    @ApiProperty({ type: [Number], example: [1, 2, 3] })
    @IsArray()
    @IsNumber({}, { each: true })
    workerIds?: number[];

    @ApiProperty({ type: [Number], example: [1, 2, 3] })
    @IsArray()
    @IsNumber({}, { each: true })
    @IsOptional()
    inChargedIds?: number[];
}
