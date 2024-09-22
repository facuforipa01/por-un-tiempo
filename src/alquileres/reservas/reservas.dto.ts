import { IsNotEmpty, IsOptional } from "class-validator";
import { UsuarioDto } from "src/usuarios/usuarios.dto";
import { DepartamentoDto } from "../departamentos/departamentos.dto";
import { Estado } from "./reservas.entity";

export class ReservaDto {

    id: number;

    @IsOptional()
    desde: Date;

    @IsOptional()
    hasta: Date;

    @IsNotEmpty()
    @IsNotEmpty()
    usuario: UsuarioDto;

    @IsNotEmpty()
    departamento: DepartamentoDto;

    @IsNotEmpty()
    estado: Estado;

}