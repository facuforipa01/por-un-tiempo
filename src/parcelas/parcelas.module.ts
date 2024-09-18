import { Module } from '@nestjs/common';
import { ParcelasController } from './parcelas.controller';
import { ParcelasService } from './parcelas.service';

@Module({
  controllers: [ParcelasController],
  providers: [ParcelasService]
})
export class ParcelasModule {}
