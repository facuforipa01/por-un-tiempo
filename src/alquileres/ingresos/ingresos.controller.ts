import { Body, Controller, Get, HttpStatus, Param, Post, Query, Res } from '@nestjs/common';
import { IngresosService } from './ingresos.service';
import { PaginationQueryDto } from 'src/common';
import { response, Response } from 'express';

@Controller('ingresos')
export class IngresosController {

    constructor(private readonly service: IngresosService) { }

    //CARGAR UNA ENTRADA
    @Post('entrada')
    async ocuparParcela(
        @Body('usuarioId') usuarioId: number,
        @Body('parcelaId') parcelaId: number,
        @Res() response: Response,
    ) {
        const result = await this.service.ocuparParcela(usuarioId, parcelaId);
        response.status(HttpStatus.OK).json({ ok: true, msg: 'ingreso a la parcela exitoso', result })
    }

    //CARGAR UNA salida
    //ingresoID por ahora es el codigo unico
    @Post('salida')
    async desocuparParcela(
        @Body('parcelaId') parcelaId: number,
        @Body('usuarioId') usuarioId: number,
        @Body('ingresoId') ingresoId: number,
        @Res() response: Response,
    ) {
        const result = await this.service.desocuparParcela(parcelaId, usuarioId, ingresoId);
        response.status(HttpStatus.OK).json({ ok: true, msg: 'parcela desocupada', result })
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
