import { Parcela } from "src/parcelas/parcelas.entity";
import { Usuarios } from "src/usuarios/usuarios.entity";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn, TableForeignKey } from "typeorm";

@Entity('ingresos')
export class Ingreso {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'date', nullable: false })
    entrada: Date

    @Column({ type: 'date', nullable: true })
    salida: Date

    //quien ingresa
    @OneToOne(type => Usuarios, usuario => usuario.id)
    usuario: Usuarios;

    //a que parcela
    @OneToOne(type => Parcela, parcela => parcela.id)
    parcela: Parcela;
}
