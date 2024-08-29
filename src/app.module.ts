//este es el modulo raiz, se encarga de tramsferir configuraciones y dependencias a los otros modulos
//aca se configuran modulos globales oara garantizar el acceso

import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosModule } from './usuarios/usuarios.module';
import { JwtMiddleware } from './usuarios/auth/middlewares/jwt/jwt.middleware';

@Module({
  imports: [
    //las configuraciones de este modulo ahora son globales
    // y abarcan toda la aplicacion
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DATABASE,
      entities: [],
      autoLoadEntities: true, //!carga las entidades
      synchronize: true, //!migraciobes de tablas automatica
    }),
    UsuariosModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .exclude(
        {
          path: 'usuarios/auth/login',
          method: RequestMethod.POST,
        },
        {
          path: 'usuarios/auth/register',
          method: RequestMethod.POST,
        }
      )
      .forRoutes('')
  }
}
