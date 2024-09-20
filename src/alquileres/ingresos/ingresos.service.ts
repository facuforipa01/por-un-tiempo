import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ingreso } from './ingresos.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { IngresoDto } from './ingresos.dto';
import { ParcelaDto } from '../parcelas/parcelas.dto';
import { Parcela } from '../parcelas/parcelas.entity';
import { Usuarios } from 'src/usuarios/usuarios.entity';
import { UsuarioDto } from 'src/usuarios/usuarios.dto';

@Injectable()
export class IngresosService {
    constructor(
        @InjectRepository(Ingreso)
        private readonly repo: Repository<IngresoDto>,
        @InjectRepository(Parcela)
        private readonly parcela: Repository<ParcelaDto>,
        @InjectRepository(Usuarios)
        private readonly usuario: Repository<UsuarioDto>
    ) { }

  /**   async guardarIngreso(
        userid: number,
        parcelaid: number,
        ingreso: IngresoDto,
    ) {
        try {
            const usuario = await this.usuario.find({ where: { id: parcelaid } })
            if (!usuario) throw new NotFoundException('usuario no encontrado')

            const parcela = await this.parcela.find({ where: { id: userid } })
            if (!parcela) throw new NotFoundException('parcela no encontrado')

            const result = await this.repo.save(ingreso)

            return result

        } catch (err) {

            console.error(err)
            if (err instanceof QueryFailedError)
                throw new HttpException(`${err.name} ${err.driverError}`, 404);
            throw new HttpException(err.message, err.status)
        }
    }
        */


    // ocupar parcela
    // chequear que exista la parcela y que no este ocupada
    // chequear que exista el usuario 
    // cargar el usuario
    // cargar la fecha actual en ingresos/entrada
    // cambiar a true la ocupacion parcela/ocupacion

    async ocuparParcela(parcelaid: number, usuarioid: number): Promise<ParcelaDto> {
        const parcela = await this.parcela.findOneBy({ id: parcelaid });

        if (!parcela) throw new NotFoundException('Parcela no encontrada');

        if (parcela.ocupada) throw new NotFoundException('Parcela ocupada');

        parcela.ocupada = true;

        const nuevoIngreso = new Ingreso(
            
        )

        nuevoIngreso.entrada = new Date(Date.now() * 1000)
        nuevoIngreso.parcela = parcela

        await this.repo.save(nuevoIngreso);
 
        return this.parcela.save(parcela)
      
}

    // desocupar parcela
    // chequear que exista la parcela y que este ocupada
    // chequear que exista el usuario
    // cargar la fecha actual en ingresos/salida
    // cambiar a false la ocupacion parcela/ocupacion

}


