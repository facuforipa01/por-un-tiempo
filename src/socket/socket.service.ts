import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { Payload } from 'src/common';

@Injectable()
export class SocketService {

    /**
     * @description
     * Almacenamos usuarios conectados
     */
    private clients: { [key: string]: { socket: Socket; payload: Payload } } = {};

/**
     * @description
     * obtenemos un socket a traves de un id de un usuario
     */
getSocket(id: number) {
    //recorremos la lista 
    for (let key in this.clients) {
        //retornamos el valor
        if (this.clients[key].payload.sub == id) return this.clients[key];
        //si no existe, nulo
        else return null
    }
}


    /**
     * @description
     * Almacenamos el socket del usuario identificando por id unico generado
     */
    onConnection(socket: Socket, payload: Payload) {
        this.clients[socket.id] = { socket: socket, payload: payload };

        
    }

    

    

    /**
     * @description
     * Una vez desconectado, se elimina de la lista
     */
    onDisconnection(socket: Socket) {
        delete this.clients[socket.id];
    }
}
