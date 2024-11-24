import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('departamentos')
export class Departamento {
    //identificador de depto
    @PrimaryGeneratedColumn('increment')
    id: number;

    //nombre de parcela
    @Column({ type: 'varchar', nullable: true })
    nombre: string



}