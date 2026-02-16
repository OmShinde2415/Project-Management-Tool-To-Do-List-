import "dotenv/config";
import http from "http";
import app from "./app";
import { connectDB } from "./config/db";
import { initSocket } from "./sockets";

const port = Number(process.env.PORT || 5000);

const start = async () => {
  await connectDB(process.env.MONGO_URI as string);

  const server = http.createServer(app);
  initSocket(server);

  server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
};

start().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
