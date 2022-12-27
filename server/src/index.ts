import { createServer, Server } from "http";
import { ServerSocket } from "./server.js";

const server: Server = createServer();


new ServerSocket(server);


server.listen(3000);