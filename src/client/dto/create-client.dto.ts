import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateClientDto {

    @ApiProperty({example: "Juan"})
    @IsString()
    name: string;

    @ApiHideProperty()
    @Type (() => Number)
    @IsNumber()
    @IsOptional()
    id_user?: number
}
