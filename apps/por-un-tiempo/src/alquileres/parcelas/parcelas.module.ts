import { Module } from '@nestjs/common';
import { ParcelasController } from './parcelas.controller';
import { ParcelasService } from './parcelas.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Parcela } from './parcelas.entity';

@Module({
  imports: [
    //para que cree la tabla en la bd
    TypeOrmModule.forFeature([Parcela])
  ],
  controllers: [ParcelasController],
  providers: [ParcelasService],
  exports: [ParcelasService]
})
export class ParcelasModule {}
