import { Parcela } from "src/alquileres/parcelas/parcelas.entity";
import { Usuarios } from "src/usuarios/usuarios.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('ingresos')
export class Ingreso {
    //identificador de ingreso
    @PrimaryGeneratedColumn('increment')
    id: number;

    //cuando la usa
    @Column({ type: 'date', nullable: false })
    entrada: Date
    @Column({ type: 'date', nullable: true })
    salida: Date

    //quien ingresa
    @ManyToOne(() => Usuarios, usuario => usuario.id)
    @JoinColumn({name: 'userId'})
    usuario: Usuarios;
    
    //a que parcela
    @ManyToOne(() => Parcela, parcela => parcela.id)
    @JoinColumn({name: 'parcelaId'})
    parcela: Parcela;
}
