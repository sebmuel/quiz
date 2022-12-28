import { Server as HttpServer } from "http";
import { Socket, Server } from "socket.io";
import { v4 } from "uuid";

export class ServerSocket {
  public static instance: ServerSocket;
  public init: boolean;
  // setting up socket server
  public io: Server;

  /** List of aller users conntect to the socket instance */
  public users: { [uid: string]: string };

  // pass in a httpServer instance to bind the Socket Server to
  constructor(server: HttpServer) {
    ServerSocket.instance = this;
    this.users = {};
    this.io = new Server(server, {
      serveClient: false,
      pingInterval: 100000,
      pingTimeout: 5000,
      cookie: false,
      cors: {
        origin: "*",
      },
    });

    this.init = false;
    if(!this.init){
        this.io.on("connect", this.StartListeners);
    }

    console.info("Socket Started!");
  }

  StartListeners = (socket: Socket): void => {

    this.init = true;

    const now: Date = new Date(Date.now());

    console.log(
      `${socket.id} Connected -> ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`
    );

    socket.on("handshake", (callback: (uid: string, users: string[]) => void) => {

      console.log(`Handshake received from ${socket.id}`);

      /** Check if this is a reconnection  */
      const reconnected = Object.values(this.users).includes(socket.id);

      if (reconnected) {

        console.info("This user has reconnected");

        const uid = this.GetUidFromSocketId(socket.id);
        const users = Object.values(this.users);

        if (uid) {
          console.info("Sending callback for reconect ...");
          callback(uid, users);
          return;
        }
      }

      /** Generate new user */
      const uid = v4();
      this.users[uid] = socket.id;

      const users = Object.values(this.users);
      console.info("Sending callback for handshake ...");
      callback(uid, users);

      /** send new user to all connected users */
      this.SendMessage(
        "user_connected",
        users.filter((id) => id !== socket.id),
        users
      );
    });

    socket.on("disconnect", () => {
      console.log(`Disconnect recived from ${socket.id}`);
      
      const uid = this.GetUidFromSocketId(socket.id);

      if (uid) {
        delete this.users[uid];
        const users = Object.values(this.users);
        this.SendMessage("user_disconnected", users, socket.id);
      }
    });
  };

  GetUidFromSocketId = (id: string) => {
    return Object.keys(this.users).find((uid) => this.users[uid] === id);
  }
    

  /**
   * Send a message through the socket
   * @param name The name of the event, ex: handshake
   * @param users List of socked id's
   * @param payload any information needed by the user for state updates
   */

  SendMessage = (name: string, users: string[], payload?: Object) => {
    console.info("Emitting event: " + name + " to ", users);
    users.forEach((id) => (payload ? this.io.to(id).emit(name, payload) : this.io.to(id).emit(name)));
  };
}
