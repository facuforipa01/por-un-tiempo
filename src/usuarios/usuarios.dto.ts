import { IsBoolean, IsEmail, IsEnum, IsString, } from "class-validator";
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
    role?: Role;

    @IsBoolean()
    isActive?: boolean = true;

    @IsString()
    avatar: string;
}