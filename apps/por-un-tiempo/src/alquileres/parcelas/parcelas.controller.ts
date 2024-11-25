import { BadRequestException, Body, Controller, Get, Headers, HttpStatus, Param, Post, Query, Res } from '@nestjs/common';
import { ParcelasService } from './parcelas.service';
import { Response } from 'express';
import { PaginationQueryDto } from '../../common';
import { Parcela } from './parcelas.entity';

@Controller('parcelas')
export class ParcelasController {
    constructor(private readonly service: ParcelasService) { }

    @Get(':id')
    async getOne(@Param('id') id: number, @Res() response: Response) {
        const parcela = await this.service.getOne(id);
        response.status(HttpStatus.OK).json({ ok: true, result: parcela, msg: 'approved' })
    }
    @Get('/')
    async getAll(@Query() paginationQuery: PaginationQueryDto, @Res() response: Response){
        const parcelas = await this.service.getAll(paginationQuery);
     response.status(HttpStatus.OK).json({ ok: true, parcelas, msg: 'approved' })
    }
    @Post('/nuevo')
    async create(@Body() parcela: Parcela, @Res() response: Response) {
        if (!parcela.nombre) throw new BadRequestException('ingrese un nombre para la parcela');
        const parcelaCreated = await this.service.create(parcela);
        response.status(HttpStatus.CREATED).json({ ok: true, parcelaCreated, msg: 'created' })
    }

}
