import { Module } from '@nestjs/common';
import { IngresosController } from './ingresos.controller';
import { IngresosService } from './ingresos.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ingreso } from './ingresos.entity';
import { Parcela } from '../parcelas/parcelas.entity';
import { Usuarios } from '../../usuarios/usuarios.entity';
import { ParcelasService } from '../parcelas/parcelas.service';

@Module({
  imports: [
    //solo deberia importar la principal de cada modulo
    TypeOrmModule.forFeature([Ingreso, Parcela, Usuarios]),
  ],
  controllers: [IngresosController],
  providers: [IngresosService, ParcelasService]
})
export class IngresosModule {}
