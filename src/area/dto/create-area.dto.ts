import { IsInt, IsString } from "class-validator";

export class CreateAreaDto {
    /**
     * @example "ID"
     */
    @IsInt()
    id: number;
    /**
     * @example "Area de trabajo"
     */
    @IsString()
    name: string;
}
