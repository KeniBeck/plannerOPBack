
    import { IsEmail, IsString } from "class-validator";

    export class CreateUserDto {
        /**
         * @example "John"
         */
        @IsString()
        name: string;
    
        /**
         * @example "Smith"
         */
        @IsString()
        username: string;
    
        /**
         * @example "000-000-000"
         */
        @IsString()
        dni: string;
    
        /**
         * @example "3222###"
         */
        @IsEmail()
        phone: string;
    
        /**
         * @example "password"
         */
        @IsString()
        password: string;

        /**
         * @example "Area de trabajo"
         */
        @IsString()
        area: string;

        /**
         * @example "Rol"
         */
        @IsString()
        rol: string;
    }


