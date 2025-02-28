import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsString } from "class-validator";

export class CreateTaskDto {


    
    @ApiProperty({example: "Task 1"})
    @IsString()
    name: string;
    
    @ApiProperty({example: "1"})
    @Type(() => Number)
    @IsNumber()
    id_user: number;
}
