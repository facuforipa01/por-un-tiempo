import { Module } from '@nestjs/common';
import { ReservasController } from './reservas.controller';
import { ReservasService } from './reservas.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reserva } from './reservas.entity';
import { Departamento } from '../departamentos/departamentos.entity';
import { Usuarios } from 'src/usuarios/usuarios.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reserva, Departamento, Usuarios])],
  controllers: [ReservasController],
  providers: [ReservasService]
})
export class ReservasModule {}
