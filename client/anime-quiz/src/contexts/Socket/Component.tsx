import { PropsWithChildren, useEffect, useReducer, useState } from "react";
import { useSocket } from "../../hooks/useSocket";
import { defaultSocketContextState, SocketReducer, SocketContextProvider } from "./Context";

export interface ISocketContextComponentProps extends PropsWithChildren {}

const SocketContextComponent: React.FunctionComponent<ISocketContextComponentProps> = (props) => {
  const { children } = props;
  const [SocketState, SocketDispatch] = useReducer(SocketReducer, defaultSocketContextState);
  const [loading, setLoading] = useState(true);

  const socket = useSocket("ws://localhost:3000", {
    reconnectionAttempts: 5,
    reconnectionDelay: 5000,
    autoConnect: false,
  });

  useEffect(() => {
    /** Connect to the web socket */
    socket.connect();

    /** Save the socket in context */
    SocketDispatch({ type: "update_socket", payload: socket });

    /** Start the event listeners */
    StartListeners();

    /** Send Handshake */
    SendHandShake();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const StartListeners = () => {

    /** user connect event */
    socket.on("user_connected", (users: string[]) => {
      console.info("User connected, new user recived");
      SocketDispatch({ type: "update_users", payload: users });
    });

    socket.on("user_disconnected", (uid: string) => {
      console.info("User disconnected");
      SocketDispatch({ type: "remove_users", payload: uid });
    });

    socket.io.on("reconnect", (attempt) => {
      console.log("Reconnected on attempt: " + attempt);
    });

    socket.io.on("reconnect_attempt", (attempt) => {
      console.log("Reconnection attempt: ", attempt);
    });

    socket.io.on("reconnect_error", (error) => {
      console.log("Reconnection error: ", error);
    });

    socket.io.on("reconnect_failed", () => {
      alert("Cant conntect to socket");
    });
  };

  const SendHandShake = () => {
    console.info("Sending Handshake");
    socket.emit("handshake", (uid: string, users: string[]) => {
      console.log("User Handshake callback message recieved", uid);
      SocketDispatch({ type: "update_uid", payload: uid });
      SocketDispatch({ type: "update_users", payload: users });
      setLoading(false);
    });
  };

  if (loading) return <p>Is Loading ...</p>;

  return (
    <SocketContextProvider value={{ SocketState, SocketDispatch }}>
      {children}
    </SocketContextProvider>
  );
};

export default SocketContextComponent;
