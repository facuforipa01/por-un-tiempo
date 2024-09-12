import { OnModuleInit, UnauthorizedException } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/usuarios/auth/auth.service';
import { SocketService } from './socket.service';


@WebSocketGateway()
export class SocketGateway implements OnModuleInit {
  constructor(
    private readonly socketService: SocketService,
    private readonly auth: AuthService
  ) { }

  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', async (socket: Socket) => {

      try {
        //!verificamos el token, para obtener la informacion
        const payload = await this.auth.verifyJwt(
          socket.handshake.headers.authorization,
        );

        console.log(
          `usuario conectado con id: ${socket.id}`,
          socket.handshake.headers['usuario'],
        );

        //!emitimos mensaje de bienvenida
        this.server.emit(
          'welcome-message',
          `bienvenido a nuestro servidor usuario ${socket.id}`
        )
        //!mandamos info del usuario al servicio
        this.socketService.onConnection(socket, payload);

        const socketUsuario = this.socketService.getSocket(
          +socket.handshake.headers['usuario'],
        );
        if (socketUsuario) {
          socketUsuario.socket.emit(
            `el usuario: ${payload.nombre} establecio una conexion`,
            console.log(payload.nombre)
          );
        }

        socket.on('disconnect', () => {
          console.log(`usuario desconectado con id: ${socket.id}`);
          //!si se desconecta se elimina al usuario del servicio
          this.socketService.onDisconnection(socket);
        });
      } catch (error) {
        //!en caso de error se debe desconectar:
        socket.disconnect();
        //!mensaje de excepcion
        throw new UnauthorizedException('info incorrecta')
      }
    });
  }
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}


