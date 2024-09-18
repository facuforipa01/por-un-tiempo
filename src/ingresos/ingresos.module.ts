import { Module } from '@nestjs/common';
import { IngresosController } from './ingresos.controller';
import { IngresosService } from './ingresos.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ingreso } from './ingresos.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ingreso])
  ],
  controllers: [IngresosController],
  providers: [IngresosService]
})
export class IngresosModule {}
