import { Body, Controller, Get, Headers, HttpStatus, Param, ParseIntPipe, Patch, Post, Query, Res } from '@nestjs/common';

import { PaginationQueryDto } from 'src/common';
import { Response } from 'express';
import { ReservasService } from './reservas.service';


@Controller('reservas')
export class ReservasController {

    constructor(private readonly service: ReservasService) { }

    //crear una reserva
    @Post('reservar')
    async solicitarReserva(
        @Body('desde') desde: Date,
        @Body('hasta') hasta: Date,
        @Body('usuario') usuarioId: number,
        @Body('departamento') deptoId: number,
    ) {
        const result = this.service.reservar(desde, hasta, usuarioId, deptoId);
        return result;
    }


    //una reserva
    @Get(':id')
    async getOne(@Param('id') id: number, @Res() response: Response) {
        const reserva = await this.service.getOne(id);
        response.status(HttpStatus.OK).json({ ok: true, reserva, msg: 'approved' })
    }

    //todas las reservas
    @Get('/')
    async getAll(@Query() paginationQuery: PaginationQueryDto, @Res() response: Response) {
        const reservas = await this.service.getAll(paginationQuery);
        response.status(HttpStatus.OK).json({ ok: true, reservas, msg: 'approved' })
    }

    @Patch(':id/aceptar')
    async aceptarReserva(
      @Headers('authorization') Token: string,
      @Param('id', ParseIntPipe) id: number,
    ) {
      try {
        const splitString = Token.split('Bearer '); // Bearer ${token}
        console.log(splitString)
        const result = await this.service.aceptarReserva(id, splitString[1]);
        return result;
      } catch (error) {
        return error;
      }
    }
    @Patch(':id/aceptar')
    async rechazarReserva(
      @Headers('authorization') Token: string,
      @Param('id', ParseIntPipe) id: number,
    ) {
      try {
        const splitString = Token.split('Bearer Token'); // Bearer ${token}
        console.log(splitString)
        const result = await this.service.rechazarReserva(id, splitString[1]);
        return result;
      } catch (error) {
        return error;
      }
    }
}

