import { ConflictException, Get, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ingreso } from './ingresos.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { IngresoDto } from './ingresos.dto';
import { ParcelaDto } from '../parcelas/parcelas.dto';
import { Parcela } from '../parcelas/parcelas.entity';
import { Usuarios } from '../../usuarios/usuarios.entity';
import { UsuarioDto } from '../../usuarios/usuarios.dto';
import { PaginationQueryDto } from '../../common';
import { ParcelasService } from '../parcelas/parcelas.service';


@Injectable()
export class IngresosService {
    constructor(
        @InjectRepository(Ingreso)
        private readonly ingresoRepository: Repository<IngresoDto>,
        @InjectRepository(Parcela)
        private readonly parcelaRepositoy: Repository<ParcelaDto>,
        @InjectRepository(Usuarios)
        private readonly usuarioRepository: Repository<UsuarioDto>,
        private readonly parcelasService: ParcelasService
    ) { }

    // ocupar parcela
    async ocuparParcela(usuarioId: number, parcelaId: number): Promise<IngresoDto> {

        const parcelaFound = await this.parcelaRepositoy.findOne({ where: { id: parcelaId } });
        const usuarioFound = await this.usuarioRepository.findOne({ where: { id: usuarioId } });
        
        // chequear que exista la parcela y que no este ocupada
        if (!parcelaFound) { throw new NotFoundException(`Parcela Nro ${parcelaId} no encontrada `); }
        if (parcelaFound.ocupada) { throw new ConflictException(`Parcela Nro ${parcelaId} ocupada`); }

        
        // chequear que exista el usuario 
        if (!usuarioFound) throw new NotFoundException(`Usuario Nro ${usuarioId} no encontrado`);

        const ingreso = this.ingresoRepository.create(
            {
                // cargar el usuario
                usuario: usuarioFound,
                // cargar la parcela
                parcela: parcelaFound,
                // cargar la fecha actual en ingresos/entrada
                entrada: new Date(),
                salida: null,
            }
        )
        // si hay ingreso, entonces cambiar a true la ocupacion parcela/ocupacion
        if (ingreso) this.parcelasService.ocupar(parcelaId)

        return this.ingresoRepository.save(ingreso)

    }

    // desocupar parcela
    async desocuparParcela(parcelaId: number, usuarioId: number, ingresoId: number): Promise<IngresoDto> {

        const parcelaFound = await this.parcelaRepositoy.findOne({ where: { id: parcelaId } });
        // chequear que exista la parcela y que este ocupada
        if (!parcelaFound) { throw new NotFoundException(`Parcela no encontrada ${parcelaId}`); }
        if (!parcelaFound.ocupada) { throw new NotFoundException(`Parcela ${parcelaId} no esta ocupada`); }

         // chequear que exista el ingreso
       const ingresoEnCuestion = await this.ingresoRepository.findOne({ where: { id: ingresoId }, relations: ['usuario', 'parcela'] })
       if (!ingresoEnCuestion)  throw new NotFoundException(`Ingreso no encontrado ${ingresoId}`)
        
        const usuarioFound =await this.usuarioRepository.findOne({ where: { id: usuarioId } });

        // chequear que exista el usuario 
        if (!usuarioFound) throw new NotFoundException('Usuario no encontrado');

        //chequea que la parcela del registro coincida con la ingresada
        if (ingresoEnCuestion.parcela.id !== parcelaId) {
            throw new NotFoundException(
                `La parcela ${parcelaId} no esta en el registro ${ingresoId}`); }

        //chequea que el usuario del registro coincida con el ingresad
        if (ingresoEnCuestion.usuario.id !== usuarioId) {
            throw new NotFoundException(
                `El usuario ${usuarioId} no esta en el registro ${ingresoId}`); }

        
       const salir = (ingresoEnCuestion.usuario.id == usuarioId && ingresoEnCuestion.parcela.id == parcelaId)

        // si hay una desocupacion 
        if (salir) {
            //cambiar a false la ocupacion parcela/ocupacion
            this.parcelasService.desocupar(parcelaId)
            //cargar la fecha actual en ingresos/salida      
            this.ingresoRepository.update(ingresoId, { salida: new Date() })
        }

        return ingresoEnCuestion
    }

    async getOne(id: number): Promise<IngresoDto> {
        try {
            const ingreso = await this.ingresoRepository.findOne({ where: { id } , relations: ['usuario', 'parcela']});
            if (!ingreso) throw new NotFoundException('no encontramos ninguna parcela con ese id')
            return ingreso;
        } catch (err) {
            console.error(err)
            if (err instanceof QueryFailedError)
                throw new HttpException(`${err.name} ${err.driverError}`, 404);
            throw new HttpException(err.message, err.status)
        }

    }
    async getAll(paginationQuery: PaginationQueryDto): Promise<{
        data: IngresoDto[];
        total: number;
        page: number;
        limit: number;
    }> {
        const { page = 1, limit = 100 } = paginationQuery;
        try {
            const [ingresos, total] = await this.ingresoRepository.findAndCount({
                skip: (page - 1) * limit,
                take: limit, 
                relations: ['usuario', 'parcela']
            })
            const ingreso = await this.ingresoRepository.find();
            if (!ingreso) throw new NotFoundException('no encontramos ninguna parcela')
            return { data: ingresos, total, page, limit };
        } catch (err) {
            console.error(err)
            if (err instanceof QueryFailedError)
                throw new HttpException(`${err.name} ${err.driverError}`, 404);
            throw new HttpException(err.message, err.status)
        }

    }

}


