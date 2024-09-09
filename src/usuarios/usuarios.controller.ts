import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Request, Res, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuarioDto } from './usuarios.dto';
import { Response } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';
// import { JwtAuthGuard } from './auth/jwt-auth-guards';

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
    res.status(HttpStatus.OK).json({ ok: true, token, msg: 'approved' });
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
  @Get('/')
  async getAll(@Res() res: Response) {
    const usuario = await this.service.getAll();
    res.status(HttpStatus.OK).json({ ok: true, usuario, msg: 'approved' });
  }
  @Delete(':id')
  async delete(@Param('id') id: number, @Res() res: Response) {
    const result = await this.service.delete(id);
    res.status(HttpStatus.OK).json({ ok: true, result, msg: 'approved' });
  }
  
}


    // @UseGuards(JwtAuthGuard)
    // @Get(':id')
    // getProfile(@Request() req){
    //     return {
    //         id: req.user.id,
    //         nombre: req.user.nombre,
    //         email: req.user.email
    //     };
    // }
