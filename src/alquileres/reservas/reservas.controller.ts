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
        @Body('desde') desde: string,
        @Body('hasta') hasta: string,
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
    async acceptReserva(
      @Param('id', ParseIntPipe) id: number,
      @Headers('authorization') token: string,
      @Res() response: Response,
    ) {
      try {
        const splitString = token.split('Bearer ')[0]; // Bearer ${token}
        const result = await this.service.acceptRequest(id, splitString);
        response.status(HttpStatus.OK).json({ ok: true, msg: 'aceptada con exito', result })
      } catch (error) {
        return error;
      }
    }

    @Patch(':id/rechazar')
    async rejectReserva(
      @Param('id', ParseIntPipe) id: number,
      @Headers('authorization') token: string,
      @Res() response: Response,
    ) {
      try {
        const splitString = token.split('Bearer ')[0]; // Bearer ${token}
        const result = await this.service.rejectRequest(id, splitString);
        response.status(HttpStatus.OK).json({ ok: true, msg: 'rechazaza con exito', result })
      } catch (error) {
        return error;
      }
    }
  }