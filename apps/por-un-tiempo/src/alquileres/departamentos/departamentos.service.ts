import { HttpException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Departamento } from './departamentos.entity';
import { DepartamentoDto } from './departamentos.dto';
import { QueryFailedError, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from '../../common';
import { Role } from '../../usuarios/usuarios.entity';
import { AuthService } from '../../usuarios/auth/auth.service';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class DepartamentosService {
  constructor(
    @Inject('MAILER') private readonly proxy: ClientProxy,
    @InjectRepository(Departamento)
    private readonly deptoRepository: Repository<DepartamentoDto>,
    private readonly authService: AuthService
  ) { }


  async getOne(id: number): Promise<DepartamentoDto> {
    try {
      const parcela = await this.deptoRepository.findOne({ where: { id } });
      if (!parcela) throw new NotFoundException(`No encontramos ninguna parcela con id ${id}`)
      return parcela;
    } catch (err) {
      console.error(err)
      if (err instanceof QueryFailedError)
        throw new HttpException(`${err.name} ${err.driverError}`, 404);
      throw new HttpException(err.message, err.status)
    }

  }
  async getAll(paginationQuery: PaginationQueryDto): Promise<{
    data: DepartamentoDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page = 1, limit = 10 } = paginationQuery;
    try {
      const [depto, total] = await this.deptoRepository.findAndCount({
        skip: (page - 1) * limit,
        take: limit
      })
      const parcela = await this.deptoRepository.find();
      if (!parcela) throw new NotFoundException('No encontramos ninguna parcela')
      return { data: depto, total, page, limit };
    } catch (err) {
      console.error(err)
      if (err instanceof QueryFailedError)
        throw new HttpException(`${err.name} ${err.driverError}`, 404);
      throw new HttpException(err.message, err.status)
    }

  }

  async create(depto: Departamento){
    const nuevoDepto = this.deptoRepository.create(depto)
     await this.deptoRepository.save(nuevoDepto)
  }
}
