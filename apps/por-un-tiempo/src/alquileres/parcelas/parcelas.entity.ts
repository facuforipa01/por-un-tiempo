import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('parcelas')
export class Parcela {
    // identificador de parcela
    @PrimaryGeneratedColumn('increment')
    id: number;

    // nombre de parcela
    @Column({ type: 'varchar', nullable: true })
    nombre: string;

    @Column({ type: 'varchar', nullable: true })
    descripcion: string;

    @Column({ type: 'varchar', nullable: true })
    lat: string;

    @Column({ type: 'varchar', nullable: true })
    long: string;

    @Column({ nullable: true })
    precio: number;

    @Column({ type: 'varchar', nullable: true })
    imagen: string;

    // estado de la parcela
    @Column({ type: 'boolean', default: false})
    ocupada: boolean

}