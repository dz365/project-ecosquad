import { Server } from "socket.io";

let io;
function socket(server) {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });

    socket.on("new post", (data) => {
      io.emit("message", data);
    });
  });
}

const emitNewPostMessage = (postId, coordinates) =>
  io.emit("new post", postId, coordinates);

export { socket, emitNewPostMessage };
