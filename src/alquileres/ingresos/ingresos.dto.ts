import { IsDate, IsOptional } from "class-validator";
import { ParcelaDto } from "src/alquileres/parcelas/parcelas.dto";
import { UsuarioDto } from "src/usuarios/usuarios.dto";

export class IngresoDto {

    id: number;

    @IsDate()
    entrada: Date;

    @IsOptional()
    @IsDate()
    salida: Date;

    usuario: UsuarioDto

    parcela: ParcelaDto

}