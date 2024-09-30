import { IsDate, IsEnum, IsNotEmpty } from "class-validator";
import { UsuarioDto } from "src/usuarios/usuarios.dto";
import { DepartamentoDto } from "../departamentos/departamentos.dto";
import { Estado } from "./reservas.entity";


export class ReservaDto {

    id: number;

    @IsDate()
    desde: Date;

    @IsDate()
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