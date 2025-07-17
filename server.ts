import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

// when using middleware `hostname` and `port` must be provided below
// initialize next js app
const app = next({ dev, hostname, port });

// get next js default request handler
const handler = app.getRequestHandler();

// start the server when app is prepared
app.prepare().then(() => {
  // create node.js http server
  const httpServer = createServer(handler);

  // attach socket.io to that server
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL,
      credentials: true, // 👈 This is important if you're passing cookies or auth
    },
  });

  io.on("connection", (socket) => {
    const userId = socket.handshake.auth.userId;
    console.log("🟢 Client connected:", userId);

    socket.on("join-room", (chatId) => {
      socket.join(chatId);
      console.log(`${userId} joined chat room: ${chatId}`);
    });

    socket.on("leave-room", (chatId) => {
      socket.leave(chatId);
      console.log(`${userId} left the room: ${chatId}`);
    });

    socket.on("new-message", (message) => {
      console.log("📨 New message from", userId, "in chat", message.chatId);
      // broadcast to the room
      socket.to(message.chatId).emit("receive-message", message);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Client disconnected:", userId);
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
