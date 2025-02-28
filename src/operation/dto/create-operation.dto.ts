import { ApiProperty } from "@nestjs/swagger"
import {  StatusOperation } from "@prisma/client"
import { Type } from "class-transformer"
import { IsEnum, IsNumber, IsString } from "class-validator"

export class CreateOperationDto {

    @ApiProperty({example:`${Object.values(StatusOperation).join(', ')}` })
    @IsEnum(StatusOperation, {
        message: `status debe ser uno de los siguientes valores: ${Object.values(StatusOperation).join(', ')}`
    })
    status :StatusOperation

    @ApiProperty({example: "2021-09-01"})
    @IsString()
    dateStart: string
    
    @ApiProperty({example: "2021-09-01"})
    @IsString()
    dateEnd: string

    @ApiProperty({example: "08:00"})
    @IsString()
    timeStrat: string

    @IsString()
    @ApiProperty({example: "17:00"})
    timeEnd: string

    @ApiProperty({example: "1"})
    @Type (() => Number)
    @IsNumber()
    id_user: number
    
    @ApiProperty({example: "1"})
    @Type (() => Number)
    @IsNumber()
    id_area: number

    @ApiProperty({example: "1"})
    @Type (() => Number)
    @IsNumber()
    id_task: number

}
