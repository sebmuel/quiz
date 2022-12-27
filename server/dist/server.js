import { Server } from 'socket.io';
export class ServerSocket {
    // pass in a httpServer instance to bind the Socket Server to
    constructor(server) {
        this.StartListeners = (socket) => {
            const now = new Date(Date.now());
            console.log(`Message from ${socket.id} -> ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`);
        };
        ServerSocket.instance = this;
        this.users = {};
        this.io = new Server(server, {
            cors: {
                origin: '*'
            }
        });
        this.io.on('connect', this.StartListeners);
        console.info("Socket Started!");
    }
}
//# sourceMappingURL=server.js.map