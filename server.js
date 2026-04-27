import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

import chokidar from "chokidar";
import dotenv from "dotenv";
import express from "express";
import { WebSocket, WebSocketServer } from "ws";

import baseRoutes from "./routes/baseRoute.js";
import staticRoutes from "./routes/static.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const NODE_ENV = process.env.NODE_ENV || "production";
const PORT = Number(process.env.PORT) || 3000;
const isProduction = NODE_ENV === "production";
const host = isProduction ? undefined : "127.0.0.1";

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(staticRoutes);
app.use("/", baseRoutes);

const server = http.createServer(app);

if (!isProduction) {
  const reloadClients = new Set();
  const reloadSocketServer = new WebSocketServer({
    server,
    path: "/live-reload",
  });
  const reloadWatcher = chokidar.watch(
    [path.join(__dirname, "views"), path.join(__dirname, "public")],
    {
      ignoreInitial: true,
      interval: 250,
      usePolling: true,
    },
  );

  const sendReloadMessage = () => {
    for (const client of reloadClients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send("reload");
      }
    }
  };

  reloadSocketServer.on("connection", (socket) => {
    reloadClients.add(socket);

    socket.on("close", () => {
      reloadClients.delete(socket);
    });
  });

  reloadWatcher.on("all", () => {
    setTimeout(sendReloadMessage, 100);
  });
}

server.listen(PORT, host, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
