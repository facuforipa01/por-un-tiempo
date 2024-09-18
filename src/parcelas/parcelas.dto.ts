import { IsString } from "class-validator"

export class ParcelaDto {

    id: number

    @IsString()
    nombre: string
}