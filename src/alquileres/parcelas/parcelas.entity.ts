import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('parcelas')
export class Parcela {
    // identificador de parcela
    @PrimaryGeneratedColumn('increment')
    id: number;

    // nombre de parcela
    @Column({ type: 'varchar', nullable: true })
    nombre: string;

    // estado de la parcela
    @Column({ type: 'boolean', default: false})
    ocupada: boolean

    //agregar columna descripcion

    //agregar columna precio

}