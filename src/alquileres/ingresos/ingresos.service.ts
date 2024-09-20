import { Get, HttpException, HttpStatus, Injectable, NotFoundException, Param, Query, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ingreso } from './ingresos.entity';
import { QueryFailedError, Repository, UpdateResult } from 'typeorm';
import { IngresoDto } from './ingresos.dto';
import { ParcelaDto } from '../parcelas/parcelas.dto';
import { Parcela } from '../parcelas/parcelas.entity';
import { Usuarios } from 'src/usuarios/usuarios.entity';
import { UsuarioDto } from 'src/usuarios/usuarios.dto';
import { PaginationQueryDto } from 'src/common';
import { ParcelasService } from '../parcelas/parcelas.service';
import { number } from 'joi';


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
        // chequear que exista la parcela y que no este ocupada
        if (!parcelaFound) { throw new NotFoundException(`Parcela no encontrada ${parcelaId}`); }
        if (parcelaFound.ocupada) { throw new NotFoundException(`Parcela ${parcelaId} ocupada`); }

        const usuarioFound = await this.usuarioRepository.findOne({ where: { id: usuarioId } });
        // chequear que exista el usuario 
        if (!usuarioFound) throw new NotFoundException('Usuario no encontrado');

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
        if (ingreso) this.parcelasService.update(parcelaId)

        return this.ingresoRepository.save(ingreso)

    }

    // desocupar parcela
    async desocuparParcela(parcelaId: number, usuarioId: number, ingresoId: number): Promise<IngresoDto> {
        const parcelaFound = await this.parcelaRepositoy.findOne({ where: { id: parcelaId } });
        // chequear que exista la parcela y que este ocupada
        if (!parcelaFound) { throw new NotFoundException(`Parcela no encontrada ${parcelaId}`); }
        if (!parcelaFound.ocupada) { throw new NotFoundException(`Parcela ${parcelaId} no esta ocupada`); }

        
        const usuarioFound =await this.usuarioRepository.findOne({ where: { id: usuarioId } });
        // chequear que exista el usuario 
        if (!usuarioFound) throw new NotFoundException('Usuario no encontrado');

       // chequear que el usuario este en la parcela
       const ingresoEnCuestion = await this.ingresoRepository.findOne({ where: { id: ingresoId }, relations: ['usuario'] })
       if (!ingresoEnCuestion)  throw new NotFoundException(`Ingreso no encontrado ${ingresoId}`)
        
     
        if (ingresoEnCuestion.usuario.id !== usuarioId) {
            throw new NotFoundException(`Ingreso ${ingresoEnCuestion.id} no registra al usuario ${usuarioId}, por lo tanto no puede salir de la parcela ${parcelaId} si no esta adentro xd`)
        }

        
       const salir = (ingresoEnCuestion.usuario.id == usuarioId)
       //const salir = true

        // si hay una desocupacion 
        if (salir) {
            //cambiar a false la ocupacion parcela/ocupacion
            this.parcelasService.downgrade(parcelaId)
            //cargar la fecha actual en ingresos/salida      
            this.ingresoRepository.update(ingresoId, { salida: new Date() })
        }

        return 
    }
    async desupdate(parcelaId: number) {

        try {
            const salida = await this.ingresoRepository.findOne({ where: { id: parcelaId } });
            if (!salida) throw new NotFoundException('no encontramos ninguna parcela con ese id')
            await this.ingresoRepository.update(parcelaId, { salida: new Date() });
            return salida;


        } catch (err) {
            console.error(err);
            if (err instanceof QueryFailedError)
                throw new HttpException(`${err.name} ${err.driverError}`, 404);
            throw new HttpException(err.message, err.status);
        }
    }



    async getOne(id: number): Promise<IngresoDto> {
        try {
            const ingreso = await this.ingresoRepository.findOne({ where: { id } });
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
        const { page = 1, limit = 10 } = paginationQuery;
        try {
            const [ingresos, total] = await this.ingresoRepository.findAndCount({
                skip: (page - 1) * limit,
                take: limit
            })
            const ingreso = await this.ingresoRepository.find();
            if (!ingreso) throw new NotFoundException('no encontramos ninguna parcela con ese id')
            return { data: ingresos, total, page, limit };
        } catch (err) {
            console.error(err)
            if (err instanceof QueryFailedError)
                throw new HttpException(`${err.name} ${err.driverError}`, 404);
            throw new HttpException(err.message, err.status)
        }

    }

}


