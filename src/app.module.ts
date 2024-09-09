//este es el modulo raiz, se encarga de tramsferir configuraciones y dependencias a los otros modulos
//aca se configuran modulos globales oara garantizar el acceso

import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosModule } from './usuarios/usuarios.module';
import { JwtMiddleware } from './usuarios/auth/middlewares/jwt/jwt.middleware';
import { db } from './config'

@Module({
  imports: [
    //las configuraciones de este modulo ahora son globales
    // y abarcan toda la aplicacion
    TypeOrmModule.forRoot(db),
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
