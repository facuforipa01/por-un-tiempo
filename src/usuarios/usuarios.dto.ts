import { IsBoolean, IsEmail, IsEnum, IsOptional, IsString, } from "class-validator";
import { Role } from "./usuarios.entity";

export class UsuarioDto {
    id: number;

    @IsString()
    nombre: string;

    @IsEmail()
    email: string;

    @IsString()
    password: string;

    @IsEnum(
        Role,{
            message: `solo roles como ${Role.ADMIN} o ${Role.USER}`
        }
    )
    @IsOptional()
    role?: Role;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean = true;

    @IsString()
    avatar: string;

}