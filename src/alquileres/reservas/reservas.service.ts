import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reserva } from './reservas.entity';
import { ReservaDto } from './reservas.dto';
import { QueryFailedError, Repository } from 'typeorm';
import { Departamento } from '../departamentos/departamentos.entity';
import { Usuarios } from 'src/usuarios/usuarios.entity';
import { DepartamentoDto } from '../departamentos/departamentos.dto';
import { UsuarioDto } from 'src/usuarios/usuarios.dto';
import { PaginationQueryDto } from 'src/common';

@Injectable()
export class ReservasService {

    constructor(
        @InjectRepository(Reserva)
        private readonly reservaRepository: Repository<ReservaDto>,
        @InjectRepository(Departamento)
        private readonly departamentoRepository: Repository<DepartamentoDto>,
        @InjectRepository(Usuarios)
        private readonly usuarioRepository: Repository<UsuarioDto>,

    ) { }

    async reservar(desde: Date, hasta: Date, usuarioId: number, deptoId: number) {

        const deptoFound = await this.departamentoRepository.findOne({ where: { id: deptoId } });
        const usuarioFound = await this.usuarioRepository.findOne({ where: { id: usuarioId } });

        // chequear que exista el depto y que no este ocupado
        if (!deptoFound) { throw new NotFoundException(`El departamento Nro ${deptoId} no fue encontrado `); }

        // chequear que exista el usuario 
        if (!usuarioFound) throw new NotFoundException(`Usuario Nro ${usuarioId} no encontrado`);

        // busca todas las reservas en las que coincida la entrada o salida con la de la nueva reserva
        // pero tambien deberia considerar las fechas del medio
        // y tiene que coincidir el departamento...
        const reservasConfirmadas = await this.reservaRepository.find(
            {
                where: { desde: desde, hasta: hasta }, relations: ['departamento']
            } || {
                where: { desde: hasta, hasta: desde }, relations: ['departamento']
            }
        )

        var reservaConfirmadaEnEseDepto = false

        if (reservasConfirmadas.length > 0) {

            reservasConfirmadas.forEach(depto => {
                reservaConfirmadaEnEseDepto = (depto.departamento.id == deptoId)
                if (reservaConfirmadaEnEseDepto) {
                    throw new NotFoundException('en esa fecha ya hay una reserva')
                }
            })
        }

        if (usuarioFound && deptoFound && !reservaConfirmadaEnEseDepto) {
            const reserva = this.reservaRepository.create(
                {
                    // cargar el usuario
                    usuario: usuarioFound,
                    // cargar el depto
                    departamento: deptoFound,
                    // cargar las fechas de la reserva
                    desde: desde,
                    hasta: hasta,
                }
            )
            return this.reservaRepository.save(reserva)
        }





    }




    //insertar logica para chequear si hay alguna otra reserva confirmada en esa fecha
    //if (hay alguna reserva entre $desde y $hasta) { throw new NotFoundException(`El departamento Nro ${deptoId} ocupada`); }





    async getOne(id: number): Promise<ReservaDto> {
        try {
            //busca reserva de un id
            const reservaFound = await this.reservaRepository.findOne({ where: { id }, relations: ['usuario', 'departamento'] })
            //si no hay, da error
            if (!reservaFound) {
                throw new Error('Reserva no encontrada')
            }
            return reservaFound;
        } catch (err) {
            console.error(err)
            if (err instanceof QueryFailedError)
                throw new HttpException(`${err.name} ${err.driverError}`, 404);
            throw new HttpException(err.message, err.status)
        }
    }

    async getAll(paginationQuery: PaginationQueryDto): Promise<{
        data: ReservaDto[];
        total: number;
        page: number;
        limit: number;
    }> {
        const { page = 1, limit = 10 } = paginationQuery;
        try {
            const [reservas, total] = await this.reservaRepository.findAndCount({
                skip: (page - 1) * limit,
                take: limit,
                relations: ['usuario', 'departamento']
            })
            if (!reservas) throw new NotFoundException('no encontramos ninguna reserva')
            return { data: reservas, total, page, limit };

        } catch (err) {
            console.error(err)
            if (err instanceof QueryFailedError)
                throw new HttpException(`${err.name} ${err.driverError}`, 404);
            throw new HttpException(err.message, err.status)
        }
    }

}
