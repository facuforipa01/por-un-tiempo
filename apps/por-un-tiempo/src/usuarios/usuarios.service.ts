import { HttpException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuarios } from './usuarios.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { UsuarioDto } from './usuarios.dto';
import { AuthService } from './auth/auth.service';
import { PaginationQueryDto } from '../common/paginator/paginator.dto';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuarios) private readonly repo: Repository<UsuarioDto>,
    private readonly authService: AuthService
  ) { }

  async register(usuario: UsuarioDto) {
    try {
      if (!usuario.password) throw new UnauthorizedException('No password');
      const hash = await this.authService.hashPassword(usuario.password);
      usuario.password = hash
      const result = await this.repo.save(usuario);
      return result;
    } catch (err: any) {
      console.log(err)
      if (err instanceof QueryFailedError)
        throw new HttpException(`${err.name} ${err.driverError}`, 404);
      throw new HttpException(err.message, err.status);
    }
  }
  async login(email: string, pass: string) {
    try {
      const user = await this.repo.findOne({ where: { email },
        select: {email:true, password: true, id: true, role: true, nombre: true}
      });
      console.log(user);
      if (!user) throw new NotFoundException('Usuario no encontrado');
      const isPassword = await this.authService.comparePassword(
        pass,
        user.password,
      );
      if (!isPassword) throw new UnauthorizedException('Contraseña incorrecta');
      const token = await this.authService.generateJwt(user);
      return token;
    } catch (err) {
      console.error(err);
      if (err instanceof QueryFailedError)
        throw new HttpException(`${err.name} ${err.driverError}`, 404);
      throw new HttpException(err.message, err.status);
    }
  }
  /**
   * @description Obtiene el usuario
   * @param id ID  del usuario
   * @returns UsuarioDTO
   */
  async getOne(id: number): Promise<UsuarioDto> {
    try {
      const usuario = await this.repo.findOne({ where: { id } })
      if (!usuario) throw new NotFoundException('usuario no encontrado')
      return usuario
    } catch (err) {
      console.error(err)
      if (err instanceof QueryFailedError)
        throw new HttpException(`${err.name} ${err.driverError}`, 404);
      throw new HttpException(err.message, err.status)
    }
  }
  //?page=1&limit=1 para pasarle limites de pagina y cantidad de usuarios a travez del endpoint
  async getAll(paginationQuery: PaginationQueryDto): Promise<{
    data: UsuarioDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    const {page = 1, limit = 100} = paginationQuery;
    try {
      const [usuarios, total] = await this.repo.findAndCount({
        skip: (page - 1) * limit,
        take: limit
      })
      if (!usuarios) throw new NotFoundException('no hay usuarios encontrados')
      return {data: usuarios, total, page, limit}
    } catch (err) {
      console.error(err)
      if (err instanceof QueryFailedError)
        throw new HttpException(`${err.name} ${err.driverError}`, 404);
      throw new HttpException(err.message, err.status)
    }
  }
  async delete(id: number): Promise<UsuarioDto> {
    try {
      const user = await this.repo.findOne({ where: { id } }) //busca a el usuario por id
      const usuario = await this.repo.remove(user)
      return usuario        
    } catch (err) {
      console.error(err)
      if (err instanceof QueryFailedError)
        throw new HttpException(`${err.name} ${err.driverError}`, 404);
      throw new HttpException(err.message, err.status)
    }
  }
  async updateUser(
    id: number,
    user: Partial<UsuarioDto>,
    files: Express.Multer.File[],
  ) {
    try {
      if (files.length > 0) {
        user.avatar = files[0].filename;
      }
      const oldUser = await this.getOne(id);
      const mergeUser = await this.repo.merge(oldUser, user);
      const result = await this.repo.save(mergeUser);
      return result;
    } catch (err) {
      console.error(err);
      if (err instanceof QueryFailedError)
        throw new HttpException(`${err.name} ${err.driverError}`, 404);
      throw new HttpException(err.message, err.status);
    }
  }
}