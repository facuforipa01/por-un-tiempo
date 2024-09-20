import { Body, Controller, Get, HttpStatus, Param, Post, Query, Res } from '@nestjs/common';
import { IngresosService } from './ingresos.service';
import { PaginationQueryDto } from 'src/common';
import { Response } from 'express';
import { IngresoDto } from './ingresos.dto';

@Controller('ingresos')
export class IngresosController {

    constructor(private readonly service: IngresosService) { }

    //CARGAR UNA ENTRADA
    @Post('entrada')
    async ocuparParcela(
        @Body('usuarioId') usuarioId: number,
        @Body('parcelaId') parcelaId: number,
    ) {
        const result = this.service.ocuparParcela(usuarioId, parcelaId);
        return result;
    }

    //CARGAR UNA salida
    @Post('salida')
    async desocuparParcela(
        @Body('parcelaId') parcelaId: number,
        @Body('salida') salida: number,
    ) {
        const result = this.service.desocuparParcela(parcelaId, salida);
        return result;
    }
    async update(){

        
    }

    //OBTENER UN INGRESO
    @Get(':id')
    async getOne(@Param('id') id: number, @Res() response: Response) {
        const ingreso = await this.service.getOne(id);
        response.status(HttpStatus.OK).json({ ok: true, ingreso, msg: 'approved' })
    }

    //OBTENER LISTADO DE INGRESOS
    @Get('/')
    async getAll(@Query() paginationQuery: PaginationQueryDto, @Res() response: Response) {
        const ingresos = await this.service.getAll(paginationQuery);
        response.status(HttpStatus.OK).json({ ok: true, ingresos, msg: 'approved' })
    }
}
