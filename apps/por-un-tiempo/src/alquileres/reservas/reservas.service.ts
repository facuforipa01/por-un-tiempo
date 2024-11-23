import { BadRequestException, HttpException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from '../../common';
import { AuthService } from '../../usuarios/auth/auth.service';
import { UsuarioDto } from '../../usuarios/usuarios.dto';
import { Role, Usuarios } from '../../usuarios/usuarios.entity';
import { In, LessThanOrEqual, MoreThanOrEqual, QueryFailedError, Repository } from 'typeorm';
import { DepartamentoDto } from '../departamentos/departamentos.dto';
import { Departamento } from '../departamentos/departamentos.entity';
import { ReservaDto } from './reservas.dto';
import { Estado, Reserva } from './reservas.entity';

@Injectable()
export class ReservasService {

    constructor(
        // alt shift o = borra todas las importaciones q no se usan
        //solo inyectar el repositorio de reservas, lo demas con los servicios
        //los servicios ya inyectan los repositorios y al llamarlos los traen
        @InjectRepository(Reserva)
        private readonly reservaRepository: Repository<ReservaDto>,
        @InjectRepository(Departamento)
        private readonly departamentoRepository: Repository<DepartamentoDto>,
        @InjectRepository(Usuarios)
        private readonly usuarioRepository: Repository<UsuarioDto>,

        private authService: AuthService,

    ) { }

    async reservar(desde: string, hasta: string, usuarioId: number, deptoId: number) {
        const desdeEntrante = new Date(desde)
        const hastaEntrante = new Date(hasta)

        const deptoFound = await this.departamentoRepository.findOne({ where: { id: deptoId } });
        const usuarioFound = await this.usuarioRepository.findOne({ where: { id: usuarioId } });

        // chequear que exista el depto y que no este ocupado
        if (!deptoFound) { throw new NotFoundException(`El departamento Nro ${deptoId} no fue encontrado `); }

        // chequear que exista el usuario 
        if (!usuarioFound) throw new NotFoundException(`Usuario Nro ${usuarioId} no encontrado`);

        // Validar fechas
        if (isNaN(desdeEntrante.getTime()) || isNaN(hastaEntrante.getTime())) {
            throw new BadRequestException('Las fechas deben ser válidas, use el formato AAAA-MM-DD');
        }
        if ((desdeEntrante.getTime()) > (hastaEntrante.getTime())) {
            throw new BadRequestException(`la fecha ${desdeEntrante} debe ser anterior a ${hastaEntrante}`);
        }

        //crea la nueva reserva 
        const reserva = this.reservaRepository.create({
            usuario: usuarioFound,
            departamento: deptoFound,
            desde: desdeEntrante,
            hasta: hastaEntrante,


        })

        //busca si se pisa con alguna reserva aceptada
        const reservaExists = await this.reservaRepository.findOne({
            where: {
                departamento: { id: deptoId },
                estado: In([Estado.ACCEPTED]),
                desde: LessThanOrEqual(hastaEntrante),
                hasta: MoreThanOrEqual(desdeEntrante)
            }
        })

        //Cuenta si hay reservas en la misma fecha
        const reservasConflictivas= await this.reservaRepository.count({
            where: {
                departamento: { id: deptoId },
                estado: In([Estado.ACCEPTED, Estado.PENDING]),
                desde: LessThanOrEqual(hastaEntrante),
                hasta: MoreThanOrEqual(desdeEntrante)
            }
        })
        //Si hay aceptada corta acá
        if (reservaExists) throw new NotFoundException(`Este depto ya tiene una reserva aceptada en esa fecha`)
        //Si no hay ninguna aceptada, corrobora q no hayan mas de 2 pendientes
        if (reservasConflictivas>=2) throw new NotFoundException(`Este depto ya tiene el maximo de reservas pendientes`)        
        //La guarda si cumple los requisitos.
        return this.reservaRepository.save(reserva)

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

    async acceptRequest(id: number, token?: string, deptoId?: number) {
        try {
            const decodedUser = await this.authService.verifyJwt(token);
            const role: Role = decodedUser.role;

            const reserva = await this.reservaRepository.findOne({ where: { id } })
            if (!reserva) throw new NotFoundException('no encontramos la reserva')

            if (role == Role.ADMIN) {
                const reserva = await this.reservaRepository.findOne({
                    where: { id },
                    relations: ['departamento'], // Aseguramos la carga del departamento
                });
                console.log(reserva.departamento.id)

                await this.reservaRepository.update(reserva, { estado: Estado.ACCEPTED });
                const reservasPendientes = await this.reservaRepository.find({
                    where: {
                        departamento: { id: reserva.departamento.id }, // Filtra por el mismo departamento
                        estado: In([Estado.PENDING]), // Solo reservas pendientes
                        desde: LessThanOrEqual(reserva.hasta), // Fechas conflictivas
                        hasta: MoreThanOrEqual(reserva.desde),
                    },
                });
                console.log(reservasPendientes)
                    for (const reservaPendiente of reservasPendientes) {
                        await this.reservaRepository.update(reservaPendiente    .id, { estado: Estado.REFUSED });
                    }
            } else {
                throw new UnauthorizedException('usted no puede aceptar reservas')
            }

        } catch (error) {
            console.error(error);
            throw new UnauthorizedException('token no valido')
        }
        return
    }

    async rejectRequest(id: number, token?: string, ) {
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
