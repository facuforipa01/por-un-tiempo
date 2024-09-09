import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { envs } from "./envs";

export const db: TypeOrmModuleOptions = {
    type: 'mysql',
    host: envs.host,
    username: envs.user,
    password: envs.pass,
    database: envs.database,
    entities: [],
    autoLoadEntities: true, //carga las entidades
    synchronize: true, //realiza las migraciones de las tablas
}