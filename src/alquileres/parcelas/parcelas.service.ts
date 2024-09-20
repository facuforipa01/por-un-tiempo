import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Parcela } from './parcelas.entity';
import { ParcelaDto } from './parcelas.dto';
import { QueryFailedError, Repository } from 'typeorm';
import { PaginationQueryDto } from 'src/common';

@Injectable()
export class ParcelasService {
    constructor(
        @InjectRepository(Parcela)
        private readonly parcelaRepository: Repository<ParcelaDto>
    ) {}


    async getOne(id: number): Promise<ParcelaDto> {
        try {
            const parcela = await this.parcelaRepository.findOne({where: {id}});
        if (!parcela) throw new NotFoundException('no encontramos ninguna parcela con ese id')
            return parcela;
        } catch (err) {
            console.error(err)
      if (err instanceof QueryFailedError)
        throw new HttpException(`${err.name} ${err.driverError}`, 404);
      throw new HttpException(err.message, err.status)
        }
        
    }
    async getAll(paginationQuery: PaginationQueryDto): Promise<{
        data: ParcelaDto[];
        total: number;
        page: number;
        limit: number;
      }> {
        const {page = 1, limit = 10} = paginationQuery;
        try {
            const [parcelas, total] = await this.parcelaRepository.findAndCount({
                skip: (page - 1) * limit,
                take: limit
              })
            const parcela = await this.parcelaRepository.find();
        if (!parcela) throw new NotFoundException('no encontramos ninguna parcela con ese id')
            return {data: parcelas, total, page, limit};
        } catch (err) {
            console.error(err)
      if (err instanceof QueryFailedError)
        throw new HttpException(`${err.name} ${err.driverError}`, 404);
      throw new HttpException(err.message, err.status)
        }
        
    }
}

