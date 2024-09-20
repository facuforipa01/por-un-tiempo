import { Body, Controller, Get, HttpStatus, Param, Post, Query, Res } from '@nestjs/common';
import { IngresosService } from './ingresos.service';
import { IngresoDto } from './ingresos.dto';
import { PaginationQueryDto } from 'src/common';
import { Response } from 'express';

@Controller('ingresos')
export class IngresosController {

    constructor(private readonly service: IngresosService) {}

    //CARGAR UNA ENTRADA
    @Post('entrada')
    async ocuparParcela(
        @Body() 
        usuario: number,
        parcela: number
        
    ) {
        const result = this.service.ocuparParcela(usuario, parcela);
    
        return result;
    }

    //OBTENER UN INGRESO
    @Get(':id')
    async getOne(@Param('id') id: number, @Res() response: Response){
        const ingreso = await this.service.getOne(id);
     response.status(HttpStatus.OK).json({ ok: true, ingreso, msg: 'approved' })
    }

    //OBTENER LISTADO DE INGRESOS
    @Get('/')
    async getAll(@Query() paginationQuery: PaginationQueryDto, @Res() response: Response){
        const ingresos = await this.service.getAll(paginationQuery);
     response.status(HttpStatus.OK).json({ ok: true, ingresos, msg: 'approved' })
    }
}
