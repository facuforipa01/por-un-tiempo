import { IsDate, IsDateString, IsEnum, IsNotEmpty } from "class-validator";
import { UsuarioDto } from "src/usuarios/usuarios.dto";
import { DepartamentoDto } from "../departamentos/departamentos.dto";
import { Estado } from "./reservas.entity";
import { strict } from "assert";


export class ReservaDto {

    id: number;

    @IsDateString({strict: false})
    desde: Date;

    @IsDateString({strict: false})
    hasta: Date;

    @IsNotEmpty()
    usuario: UsuarioDto;

    @IsNotEmpty()
    departamento: DepartamentoDto;

    @IsNotEmpty()
    @IsEnum(
        Estado,{
            message: `solo estados como ${Estado.ACCEPTED}/${Estado.PENDING}/${Estado.REFUSED}`
        }
    )
    estado: Estado;

}