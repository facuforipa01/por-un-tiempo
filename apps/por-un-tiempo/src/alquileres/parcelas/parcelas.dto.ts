import { IsString } from "class-validator"

export class ParcelaDto {

    id: number

    @IsString()
    nombre: string

    descripcion: string

    lat:string

    long:string

    precio: number

    imagen: string

    ocupada: boolean
}