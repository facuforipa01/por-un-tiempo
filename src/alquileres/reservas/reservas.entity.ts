import { Usuarios } from "src/usuarios/usuarios.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Departamento } from "../departamentos/departamentos.entity";

@Entity('reservas')
export class Reserva {
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
    @ManyToOne(() => Departamento, departamento => departamento.id)
    @JoinColumn({name: 'parcelaId'})
    departamento: Departamento;
}