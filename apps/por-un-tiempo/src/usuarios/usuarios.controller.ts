import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Query, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuarioDto } from './usuarios.dto';
import { Response } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';
import { PaginationQueryDto } from '../common/paginator/paginator.dto';

@Controller('usuarios') 
export class UsuariosController {

  constructor(private readonly service: UsuariosService) { }

  @Post('auth/register')
  async register(@Body() usuario: UsuarioDto, @Res() response: Response) {
    const result = await this.service.register(usuario);
    response
      .status(HttpStatus.CREATED)
      .json({ ok: true, result, msg: 'creado' });
  }

  @Post('auth/login')
  async login(
    @Body() usuario: { email: string; password: string },
    @Res() res: Response,
  ) {
    const token = await this.service.login(usuario.email, usuario.password);
    const userid = await this.service.getOnebyEmail(usuario.email)
    res.status(HttpStatus.OK).json({ ok: true, result:token, msg: `${userid.id}` });
  }

  @Patch(':id')
  @UseInterceptors(FilesInterceptor('files'))
  async updateUser(
    @Param('id') id: number,
    @Body() user: Partial<UsuarioDto>,
    @UploadedFiles() files: Express.Multer.File[],
    @Res() res: Response,
  ) {
    const result = await this.service.updateUser(id, user, files);
    res.status(HttpStatus.OK).json({ ok: true, result, msg: 'approved' });
  }

  @Get(':id')
  async getOne(@Param('id') id: number, @Res() res: Response) {
    const usuario = await this.service.getOne(id);
    res.status(HttpStatus.OK).json({ ok: true, usuario, msg: 'approved' });
  }

  // @Get('email/:email')
  // async getOnebyEmail(@Param('email') email: string, @Res() res: Response) {
  //   const usuario = await this.service.getOnebyEmail(email);
  //   res.status(HttpStatus.OK).json({ ok: true, usuario, msg: 'approved' });
  // }

  @Get('/')
  async getAll(@Query() paginationQuery: PaginationQueryDto, @Res() res: Response) {
    const usuario = await this.service.getAll(paginationQuery);
    res.status(HttpStatus.OK).json({ ok: true, usuario, msg: 'approved' });
  }

  @Delete(':id')
  async delete(@Param('id') id: number, @Res() res: Response) {
    const result = await this.service.delete(id);
    res.status(HttpStatus.OK).json({ ok: true, result, msg: 'approved' });
  }
}


