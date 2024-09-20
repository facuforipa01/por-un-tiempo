import { Body, Controller, Param, Post } from '@nestjs/common';
import { IngresosService } from './ingresos.service';
import { IngresoDto } from './ingresos.dto';

@Controller('ingresos')
export class IngresosController {

    constructor(private readonly service: IngresosService) {}

    @Post('entrada')
    async ocuparParcela(
        @Body() 
        usuario: number,
        parcela: number
        
    ) {
        const result = this.service.ocuparParcela(usuario, parcela);
    
        return result;
    }
}
