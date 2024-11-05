import { BadRequestException, Body, Controller, Get, Headers, HttpStatus, Param, Post, Query, Res } from '@nestjs/common';
import { DepartamentosService } from './departamentos.service';
import { PaginationQueryDto } from '../../common';
import { Response } from 'express';
import { Departamento } from './departamentos.entity';

@Controller('departamentos')
export class DepartamentosController {
    constructor(private readonly service: DepartamentosService) { }

    @Get(':id')
    async getOne(@Param('id') id: number, @Res() response: Response) {
        const depto = await this.service.getOne(id);
        response.status(HttpStatus.OK).json({ ok: true, depto, msg: 'approved' })
    }
    @Get('/')
    async getAll(@Query() paginationQuery: PaginationQueryDto, @Res() response: Response) {
        const deptos = await this.service.getAll(paginationQuery);
        response.status(HttpStatus.OK).json({ ok: true, deptos, msg: 'approved' })
    }
    @Post('/nuevo')
    async create(@Body() depto: Departamento, @Res() response: Response) {
        if (!depto.nombre) throw new BadRequestException('ingrese un nombre del depto');
        const deptoCreated = await this.service.create(depto);
        response.status(HttpStatus.CREATED).json({ ok: true, deptoCreated, msg: 'created' })
    }
    //falta importar modulo auth correctamente
    // @Post('/nuevo')
    // async create(
    //     @Body() depto: Departamento, 
    //     @Headers('authorization') token: string,
    //     @Res() response: Response) {
    //     if (!depto.nombre) throw new BadRequestException('ingrese un nombre para el departamento');
    //     const splitString = token.split('Bearer ')[0]; // Bearer ${token}
    //     const deptoCreated = await this.service.create(depto, splitString);
    //     response.status(HttpStatus.CREATED).json({ ok: true, deptoCreated, msg: 'created' })
    // }

}
