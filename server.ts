import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import { DataForReceiver, Message } from "./types/chat-types";

const dev = process.env.NODE_ENV !== "production";
// const hostname = "localhost";
const port = parseInt(process.env.PORT || "3000");

// when using middleware `hostname` and `port` must be provided below
// initialize next js app
// const app = next({ dev, hostname, port });
const app = next({ dev, port });

// get next js default request handler
const handler = app.getRequestHandler();

// create usersocket map -
const userSocketMap = new Map<string, Set<string>>();

// start the server when app is prepared
app.prepare().then(() => {
  // create node.js http server
  const httpServer = createServer(handler);

  // attach socket.io to that server
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL,
      credentials: true, // important if you're passing cookies or auth
    },
  });

  io.on("connection", (socket) => {
    const userId = socket.handshake.auth.userId;
    console.log("🟢 Client connected:", userId);

    // add this socket to userSocketmap if not already added, a user can have multiple socket (various devices logged in)
    if (!userSocketMap.has(userId)) {
      userSocketMap.set(userId, new Set());
    }
    // add socket to the set
    userSocketMap.get(userId)!.add(socket.id);

    socket.on("join-room", (chatId) => {
      if (!socket.rooms.has(chatId)) {
        // socket internally keeps track of rooms that it has joined
        socket.join(chatId);
      }
      console.log(`${userId} joined chat room: ${chatId}`);
    });

    socket.on("leave-room", (chatId) => {
      socket.leave(chatId);
      console.log(`${userId} left the room: ${chatId}`);
    });

    socket.on("new-chat", ({ sender, recieverId, data }: DataForReceiver & { recieverId: string }) => {
      const receiverSockets = userSocketMap.get(recieverId);
      if (receiverSockets && receiverSockets.size > 0) {

        receiverSockets.forEach((socketId) => {
          io.to(socketId).emit("new-chat", { sender, recieverId, data });
        });
      }
    });

    // Handle new message
    socket.on("new-message", (message: Message) => {
      console.log("📨 New message from", message.sender, "in chat", message.chatId);
      socket.to(message.chatId).emit("receive-message", message);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Client disconnected:", userId);
      // remove socket from the usersocketmap
      userSocketMap.get(userId)?.delete(socket.id);
      // if all sockets for a particular user is removed, remove the record from map
      if (userSocketMap.get(userId)?.size === 0) {
        userSocketMap.delete(userId);
      }
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on port ${port}`);
    });
});
