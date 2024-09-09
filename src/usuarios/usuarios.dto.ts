import { IsBoolean, IsEmail, IsOptional, IsString, } from "class-validator";

export class UsuarioDto {
    id: number;

    @IsString()
    nombre: string;

    @IsEmail()
    email: string;

    @IsString()
    password: string;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean = true;

    @IsString()
    avatar: string;

}