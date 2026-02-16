import { Server as HttpServer } from "http";
import { Server } from "socket.io";

export let io: Server;

export const initSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    socket.on("project:join", (projectId: string) => {
      socket.join(`project:${projectId}`);
    });

    socket.on("project:leave", (projectId: string) => {
      socket.leave(`project:${projectId}`);
    });
  });

  return io;
};
