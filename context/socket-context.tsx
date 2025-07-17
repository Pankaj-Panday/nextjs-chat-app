"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

type SocketContextType = {
  socket: Socket | null;
  isConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

  export const SocketProvider = ({ children, userId }: { children: React.ReactNode; userId: string }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
      if (!userId) return;

      const socketInstance = io(process.env.NEXT_PUBLIC_APP_URL as string, {
        autoConnect: true,
        withCredentials: true,
        auth: { userId },
      });

      setSocket(socketInstance);

      socketInstance.on("connect", () => setIsConnected(true));
      socketInstance.on("disconnect", () => setIsConnected(false));

      return () => {
        socketInstance.disconnect();
      };
    }, [userId]);

    return <SocketContext value={{ socket, isConnected }}>{children}</SocketContext>;
  };

export const useSocket = () => {
  const socket = useContext(SocketContext);
  if (!socket) throw new Error("useSocket must be used inside SocketProvider");
  return socket;
};
