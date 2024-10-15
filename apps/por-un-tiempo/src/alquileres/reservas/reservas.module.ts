import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuarios } from '../../usuarios/usuarios.entity';
import { UsuariosService } from '../../usuarios/usuarios.service';
import { Departamento } from '../departamentos/departamentos.entity';
import { ReservasController } from './reservas.controller';
import { Reserva } from './reservas.entity';
import { ReservasService } from './reservas.service';
import { UsuariosModule } from '../../usuarios/usuarios.module';
import { ClientsModule } from '@nestjs/microservices';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reserva, Departamento, Usuarios]),
     UsuariosModule,

    ClientsModule.register([
      {name: 'MAILER_MS', options: { port: 3001, host: 'localhost'}}
    ]
     )
],
  controllers: [ReservasController],
  providers: [ReservasService, UsuariosService]
})
export class ReservasModule { }
