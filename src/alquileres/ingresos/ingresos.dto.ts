import { IsDate, IsNotEmpty, IsNumber } from "class-validator";
import { ParcelaDto } from "src/alquileres/parcelas/parcelas.dto";
import { UsuarioDto } from "src/usuarios/usuarios.dto";

export class IngresoDto {

    id: number;

    @IsDate()
    entrada: Date;

    @IsDate()
    salida: Date;

    @IsNumber()
    @IsNotEmpty()
    usuario: UsuarioDto

    @IsNumber()
    @IsNotEmpty()
    parcela: ParcelaDto

}