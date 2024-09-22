import { IsString } from "class-validator"

export class DepartamentoDto {

    id: number

    @IsString()
    nombre: string
}