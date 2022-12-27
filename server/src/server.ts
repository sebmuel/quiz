import { Server as HttpServer } from 'http';
import { Socket, Server } from 'socket.io';
import { v4 } from 'uuid';

export class ServerSocket{
    public static instance: ServerSocket;
    // setting up socket server
    public io: Server;

    /** List of aller users conntect to the socket instance */
    public users: { [key: string]: string};

    // pass in a httpServer instance to bind the Socket Server to
    constructor(server: HttpServer){
        ServerSocket.instance = this;
        this.users = {};
        this.io =  new Server(server, {
            cors: {
                origin: '*'
            }
        })

        this.io.on('connect', this.StartListeners)
        console.info("Socket Started!");
    }

    StartListeners = (socket: Socket):void =>{
        const now:Date = new Date(Date.now());
        console.log(`Message from ${socket.id} -> ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`);
    }

}