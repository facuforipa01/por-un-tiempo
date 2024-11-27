import { Module } from '@nestjs/common';
import { DepartamentosController } from './departamentos.controller';
import { DepartamentosService } from './departamentos.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Departamento } from './departamentos.entity';
import { AuthService } from '../../usuarios/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsuariosService } from '../../usuarios/usuarios.service';
import { Usuarios } from '../../usuarios/usuarios.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envs } from '../../config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Departamento, Usuarios]),
    ClientsModule.register([
      {
        name: 'MAILER',
        transport: Transport.TCP,
        options: {
          //mismos q donde escucha el microservicio
          host: envs.ms_host,
          port: envs.ms_port,
        },
      }
    ])],
  controllers: [DepartamentosController],
  providers: [DepartamentosService, AuthService, JwtService, UsuariosService],
  exports: [DepartamentosService]
})
export class DepartamentosModule { }
