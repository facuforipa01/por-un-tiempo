import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum Role {
    ADMIN = "ADMIN",
    USER = "USER"
   
}

@Entity('usuarios')
export class Usuarios {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'varchar', nullable: true, length: 255 })
    nombre: string;

    @Column({ type: 'varchar', nullable: false, unique: true, length: 255})
    email: string;

    @Column({ type: 'varchar', nullable: false, length: 255})
    password: string;

    @Column({
        type: 'enum',
        enum: Role,
        default: Role.USER
    })
    role: Role;

    @Column({ type:'bool', default:true })
    isActive: boolean;

    @Column({ type: 'varchar', nullable: false, length: 255})
    avatar: string;
}