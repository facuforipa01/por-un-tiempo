import { IsBoolean, IsEmail, IsOptional, IsString, } from "class-validator";
import { Role } from "./usuarios.entity";

export class UsuarioDto {
    id: number;

    @IsString()
    nombre: string;

    @IsEmail()
    email: string;

    @IsString()
    password: string;

    role: Role;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean = true;

    @IsString()
    avatar: string;

}