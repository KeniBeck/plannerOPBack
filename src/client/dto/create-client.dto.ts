import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsString } from "class-validator";

export class CreateClientDto {

    @ApiProperty({example: "Juan"})
    @IsString()
    name: string;

    @ApiProperty({example: "1"})
    @Type (() => Number)
    @IsNumber()
    id_user: number
}
