import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from 'src/usuarios/auth/auth.service';
import { Usuarios } from 'src/usuarios/usuarios.entity';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { Departamento } from '../departamentos/departamentos.entity';
import { ReservasController } from './reservas.controller';
import { Reserva } from './reservas.entity';
import { ReservasService } from './reservas.service';
import { UsuariosModule } from 'src/usuarios/usuarios.module';

@Module({
  imports: [TypeOrmModule.forFeature([Reserva, Departamento, Usuarios]), UsuariosModule],
  controllers: [ReservasController],
  providers: [ReservasService, UsuariosService]
})
export class ReservasModule { }
