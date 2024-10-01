import { BadRequestException, Body, Controller, Get, HttpStatus, Param, Post, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { PaginationQueryDto } from '../../common';
import { IngresosService } from './ingresos.service';

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
        // Validar que 'usuario', 'parcela' no sean nulos o indefinidos
    if ( !usuarioId || !parcelaId) {
        throw new BadRequestException('Los campos usuario y parcela son requeridos.');
    }
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
            // Validar que 'usuario', 'parcela' no sean nulos o indefinidos
    if ( !usuarioId || !parcelaId || !ingresoId) {
        throw new BadRequestException('Los campos usuario, parcela y id de ingreso son requeridos.');
    }
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
