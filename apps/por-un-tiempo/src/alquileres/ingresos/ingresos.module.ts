import { Module } from '@nestjs/common';
import { IngresosController } from './ingresos.controller';
import { IngresosService } from './ingresos.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ingreso } from './ingresos.entity';
import { Parcela } from '../parcelas/parcelas.entity';
import { Usuarios } from '../../usuarios/usuarios.entity';
import { ParcelasService } from '../parcelas/parcelas.service';
import { UsuariosService } from '../../usuarios/usuarios.service';
import { UsuariosModule } from '../../usuarios/usuarios.module';
import { ParcelasModule } from '../parcelas/parcelas.module';

@Module({
  imports: [
    //solo deberia importar la principal de cada modulo
    TypeOrmModule.forFeature([Ingreso, Parcela, Usuarios]),
    UsuariosModule,
    ParcelasModule
  ],
  controllers: [IngresosController],
  providers: [IngresosService, ParcelasService]
})
export class IngresosModule {}
