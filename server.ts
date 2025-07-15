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
  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log("🟢 Client connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("🔴 Client disconnected:", socket.id);
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
