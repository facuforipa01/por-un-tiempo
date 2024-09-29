import { HttpException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from 'src/common';
import { AuthService } from 'src/usuarios/auth/auth.service';
import { UsuarioDto } from 'src/usuarios/usuarios.dto';
import { Role, Usuarios } from 'src/usuarios/usuarios.entity';
import { Between, QueryFailedError, Repository } from 'typeorm';
import { DepartamentoDto } from '../departamentos/departamentos.dto';
import { Departamento } from '../departamentos/departamentos.entity';
import { ReservaDto } from './reservas.dto';
import { Estado, Reserva } from './reservas.entity';

@Injectable()
export class ReservasService {

    constructor(
        @InjectRepository(Reserva)
        private readonly reservaRepository: Repository<ReservaDto>,
        @InjectRepository(Departamento)
        private readonly departamentoRepository: Repository<DepartamentoDto>,
        @InjectRepository(Usuarios)
        private readonly usuarioRepository: Repository<UsuarioDto>,

        private authService: AuthService,

    ) { }

    async reservar(desdeEntrante: Date, hastaEntrante: Date, usuarioId: number, deptoId: number) {

        const deptoFound = await this.departamentoRepository.findOne({ where: { id: deptoId } });
        const usuarioFound = await this.usuarioRepository.findOne({ where: { id: usuarioId } });

        // chequear que exista el depto y que no este ocupado
        if (!deptoFound) { throw new NotFoundException(`El departamento Nro ${deptoId} no fue encontrado `); }

        // chequear que exista el usuario 
        if (!usuarioFound) throw new NotFoundException(`Usuario Nro ${usuarioId} no encontrado`);

        // transforma desde, hasta a un periodo
        const periodoReservaEntrante = Between(desdeEntrante, hastaEntrante)

        // busca todas las reservas en las que coincidan las fechas
        const reservasConfirmadas = await this.reservaRepository.find(
            {
                where: [
                    { desde: periodoReservaEntrante },
                    { hasta: periodoReservaEntrante }
                ], relations: ['departamento']
            }
        )


        // se fija si ademas de las fechas coincide el departamento
        var reservaEnEseDepto = false
        var reservaAprobada = false
        var reservaImposible = false

        if (reservasConfirmadas.length > 0) {

            reservasConfirmadas.forEach(depto => {
                reservaEnEseDepto = (depto.departamento.id == deptoId)
            })
            reservasConfirmadas.forEach(reserva => {
                reservaAprobada = (reserva.estado == Estado.ACCEPTED)
            })
            var reservaImposible = (reservaEnEseDepto && reservaAprobada)
            if (reservaImposible) {
                throw new NotFoundException('en esa fecha ya hay una reserva aprobada')
            }
            
        }

        if (usuarioFound && deptoFound && !reservaImposible) {
            const reserva = this.reservaRepository.create(
                {
                    // cargar el usuario
                    usuario: usuarioFound,
                    // cargar el depto
                    departamento: deptoFound,
                    // cargar las fechas de la reserva
                    desde: desdeEntrante,
                    hasta: hastaEntrante,
                }
            )
            return this.reservaRepository.save(reserva)
        }
    }



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

    async acceptRequest(id: number, token?: string) {
        try {
            const decodedUser = await this.authService.verifyJwt(token);
            const role: Role = decodedUser.role;

            const reserva = await this.reservaRepository.findOne({ where: { id } })
            if (!reserva) throw new NotFoundException('no encontramos la reserva')

            if (role == Role.ADMIN) {
                await this.reservaRepository.update(reserva, { estado: Estado.ACCEPTED });
            } else {
                throw new UnauthorizedException('usted no puede aceptar reservas')
            }

        } catch (error) {
            console.error(error);
            throw new UnauthorizedException('token no valido')
        }
        return
    }

    async rejectRequest(id: number, token?: string) {
        try {
            const decodedUser = await this.authService.verifyJwt(token);
            const role: Role = decodedUser.role;

            const reserva = await this.reservaRepository.findOne({ where: { id } })
            if (!reserva) throw new NotFoundException('no encontramos la reserva')

            if (role == Role.ADMIN) {
                await this.reservaRepository.update(reserva, { estado: Estado.REFUSED });
            } else {
                throw new UnauthorizedException('usted no puede aceptar reservas')
            }

        } catch (error) {
            console.error(error);
            throw new UnauthorizedException('token no valido')
        }
    }






}
