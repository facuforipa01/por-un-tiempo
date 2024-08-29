import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuarioDto } from './usuarios.dto';
import { Response } from 'express';

@Controller('usuarios')
export class UsuariosController {

    constructor(private readonly service: UsuariosService) {}

    @Post('auth/register')
    async register(@Body() usuario: UsuarioDto, @Res() response: Response) {
        const result = await this.service.register(usuario);
        response
        .status(HttpStatus.CREATED)
        .json({ ok: true, result, msg: 'creado' });
    }
    @Post('auth/login')
    async login() {}

}
