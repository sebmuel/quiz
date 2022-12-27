import { createServer } from "http";
import { ServerSocket } from "./server.js";
const server = createServer();
new ServerSocket(server);
server.listen(3000);
//# sourceMappingURL=index.js.map