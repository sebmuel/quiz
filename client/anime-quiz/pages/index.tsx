import { Inter } from "@next/font/google";
import { useEffect } from "react";
import { io } from "socket.io-client";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {

  useEffect(() => {
    console.log("hi");
    const server = io("http://localhost:3000/");
  }, [])

  return (
    <div className="">
      <h2>Welcome To Anime Quiz!</h2>
      <button>Create Room</button>
      <button>Enter Room</button>
    </div>
  );
}
