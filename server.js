import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    const clientId = socket.id;
    console.log("A client connected");
    console.log(`A client connected. ID: ${clientId}`);
    io.emit("client-new", clientId);

    // socket.join("my-room");

    // Event handler for receiving messages from the client
    socket.on("message", (data) => {
      console.log("Received message:", data);
      socket.to(`room-${data.roomId}`).emit("send-message", data.message);
    });

    // Event handler for client disconnections
    socket.on("disconnect", () => {
      console.log("A client disconnected.");
    });

    socket.on("join-room", (roomId) => {
      console.log("joining room", roomId);
      socket.join(`room-${roomId}`);
    })

    socket.on("leave-room", (roomId) => {
      console.log("leaving room", roomId);
      socket.leave(`room-${roomId}`);
    })
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
