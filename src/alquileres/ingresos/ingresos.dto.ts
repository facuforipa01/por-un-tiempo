import { strict } from "assert";
import { IsDate, IsDateString, IsOptional } from "class-validator";
import { ParcelaDto } from "src/alquileres/parcelas/parcelas.dto";
import { UsuarioDto } from "src/usuarios/usuarios.dto";

export class IngresoDto {

    id: number;

    entrada: Date;

    @IsOptional()
    salida: Date;

    usuario: UsuarioDto

    parcela: ParcelaDto

}