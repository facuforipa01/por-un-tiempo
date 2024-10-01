import { Controller, Get, HttpStatus, Param, Query, Res } from '@nestjs/common';
import { DepartamentosService } from './departamentos.service';
import { PaginationQueryDto } from '../../common';
import { Response } from 'express';

@Controller('departamentos')
export class DepartamentosController {
    constructor(private readonly service: DepartamentosService) {}

    @Get(':id')
    async getOne(@Param('id') id: number, @Res() response: Response){
        const depto = await this.service.getOne(id);
     response.status(HttpStatus.OK).json({ ok: true, depto, msg: 'approved' })
    }
    @Get('/')
    async getAll(@Query() paginationQuery: PaginationQueryDto, @Res() response: Response){
        const deptos = await this.service.getAll(paginationQuery);
     response.status(HttpStatus.OK).json({ ok: true, deptos, msg: 'approved' })
    }
}
