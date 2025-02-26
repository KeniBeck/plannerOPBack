import { IsInt, IsString } from "class-validator";

export class CreateAreaDto {
    /**
     * @example "Area de trabajo"
     */
    @IsString()
    name: string;
}
