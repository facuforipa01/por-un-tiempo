import { Module } from '@nestjs/common';
import { ReservasController } from './reservas.controller';
import { ReservasService } from './reservas.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reserva } from './reservas.entity';
import { Departamento } from '../departamentos/departamentos.entity';
import { Usuarios } from 'src/usuarios/usuarios.entity';
import { AuthService } from 'src/usuarios/auth/auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UsuariosService } from 'src/usuarios/usuarios.service';

@Module({
  imports: [TypeOrmModule.forFeature([Reserva, Departamento, Usuarios])],
  controllers: [ReservasController],
  providers: [ReservasService, AuthService, JwtService, UsuariosService]
})
export class ReservasModule {}
