import { IsDateString, IsEnum, IsNotEmpty, IsNumber } from "class-validator";
import { UsuarioDto } from "../../usuarios/usuarios.dto";
import { DepartamentoDto } from "../departamentos/departamentos.dto";
import { Estado } from "./reservas.entity";


export class ReservaDto {

    id: number;

    @IsDateString({strict: false})
    desde: Date;

    @IsDateString({strict: false})
    hasta: Date;

    @IsNumber()
    usuario: UsuarioDto;

    @IsNumber()
    departamento: DepartamentoDto;

    @IsNotEmpty()
    @IsEnum(
        Estado,{
            message: `solo estados como ${Estado.ACCEPTED}/${Estado.PENDING}/${Estado.REFUSED}`
        }
    )
    estado: Estado;

}