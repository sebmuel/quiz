import { useEffect, useContext } from "react";
import { io } from "socket.io-client";
import SocketContext from "../src/contexts/Socket/Context";

export default function Home() {
  const { socket, uid, users } = useContext(SocketContext).SocketState;

  return (
    <div className="">
      <h2>Socket IO Informations</h2>
      <p>
        Your user ID: <strong>{uid}</strong>
      </p>
      <p>
        Users online: <strong>{users.length}</strong>
      </p>
      <p>
        Socket ID: <strong>{socket?.id}</strong>
      </p>
    </div>
  );
}
