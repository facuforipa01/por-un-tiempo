import { Body, Controller, Param, Post } from '@nestjs/common';
import { IngresosService } from './ingresos.service';
import { IngresoDto } from './ingresos.dto';

@Controller('ingresos')
export class IngresosController {

    constructor(private readonly service: IngresosService) {}

    @Post('entrada')
    async guardarIngreso(
        @Body() ingreso: IngresoDto,
        userid: number,
        parcelaid: number
    ) {
        const result = this.service.guardarIngreso(userid, parcelaid, ingreso);
    
        return result;
    }
}
