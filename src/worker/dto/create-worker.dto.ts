import { IsNumber, IsString } from "class-validator"
import {Status} from '@prisma/client'
import { Type } from "class-transformer"
import { ApiProperty } from "@nestjs/swagger"

export class CreateWorkerDto {
    @ApiProperty({example: "000-000-000"})
    @IsString()
    dni: string 

    @ApiProperty({example: "3222###"})
    @IsString()
    phone: string

    @ApiProperty({example: "John"})
    @IsString()
    name: string
    
    @ApiProperty({example: "Smith"})
    @IsString()
    status: Status
    
    @ApiProperty({example: "OPERACIONES"})
    @IsNumber()
    @Type(() => Number)
    id_area:number
    
    @ApiProperty({example: "1"})
    @IsNumber()
    @Type(() => Number)
    id_user: number
 
}
