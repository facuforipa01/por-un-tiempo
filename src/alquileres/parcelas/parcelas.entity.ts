import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('parcelas')
export class Parcela {
    //identificador de parcela
    @PrimaryGeneratedColumn('increment')
    id: number;

    //nombre de parcela
    @Column({ type: 'varchar', nullable: true })
    nombre: string

    //agregar columna descripcion

    //agregar columna precio

}