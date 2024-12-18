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
import { SocketModule } from './socket/socket.module';
import { ParcelasModule } from './alquileres/parcelas/parcelas.module';
import { DepartamentosModule } from './alquileres/departamentos/departamentos.module';
import { IngresosModule } from './alquileres/ingresos/ingresos.module';
import { ReservasModule } from './alquileres/reservas/reservas.module';

@Module({
  imports: [
    //las configuraciones de este modulo ahora son globales
    // y abarcan toda la aplicacion
    TypeOrmModule.forRoot(db),
    UsuariosModule,
    SocketModule,
    ParcelasModule,
    DepartamentosModule,
    IngresosModule,
    ReservasModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .exclude(
        //estas rutas se excluyen para poder obtener el token
        // ya sea iniciando sesion o registrandose
        {
          path: 'usuarios/auth/login',
          method: RequestMethod.POST,
        },
        {
          path: 'usuarios/auth/register',
          method: RequestMethod.POST,
        },
        {
          path: 'parcelas',
          method: RequestMethod.GET,
        },
        {
          path: 'departamentos',
          method: RequestMethod.GET,
        },
        {
          path: 'usuario/check',
          method: RequestMethod.POST,
        },

        //estas rutas las excluyo porque pido el token en las funciones
        // y no quiero que me lo pida de nuevo el auth
        
        {
          path: 'reservas/:id/rechazar',
          method: RequestMethod.PATCH,
        },
        {
          path: 'reservas/:id/aceptar',
          method: RequestMethod.PATCH,
        },
      )
      .forRoutes('')
  }
}
