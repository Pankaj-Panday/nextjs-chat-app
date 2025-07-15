"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Socket } from "socket.io";

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
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {});

  return <SocketContext value={{ socket, isConnected }}>{children}</SocketContext>;
};

export const useSocket = () => {
  const socket = useContext(SocketContext);
  if (!socket) throw new Error("useSocket must be used inside SocketProvider");
  return socket;
};
