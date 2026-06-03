import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

import dotenv from "dotenv";
import express from "express";

import baseRoutes from "./routes/baseRoute.js";
import catalogRoutes from "./routes/catalogRoute.js";
import { addDemoHeaders } from "./routes/demoRoute.js";
import appRoutes from "./src/routes.js";
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
app.set("views", [
  path.join(__dirname, "views"),
  path.join(__dirname, "src/views"),
]);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/**
 * Configure Express middleware
 */
app.use((req, res, next) => {
  res.locals.NODE_ENV = NODE_ENV.toLowerCase() || "production";
  res.locals.enableLiveReload = !isProduction;
  next();
});

app.use((req, res, next) => {
  if (!req.path.startsWith("/.")) {
    console.log(`${req.method} ${req.url}`);
  }

  next();
});

app.use((req, res, next) => {
  res.locals.currentYear = new Date().getFullYear();
  next();
});

app.use((req, res, next) => {
  const currentHour = new Date().getHours();

  if (currentHour < 12) {
    res.locals.greeting = "Morning";
  } else if (currentHour < 17) {
    res.locals.greeting = "Afternoon";
  } else {
    res.locals.greeting = "Evening";
  }

  next();
});

app.use((req, res, next) => {
  res.locals.bodyClass = "blue-theme";
  next();
});

app.use((req, res, next) => {
  res.locals.queryParams = req.query || {};
  next();
});

app.use(staticRoutes);
app.use("/", baseRoutes);
app.use("/catalog", catalogRoutes);
app.use("/", appRoutes);

app.get("/demo", addDemoHeaders, (req, res) => {
  res.render("demo", { title: "Page Context" });
});

app.get("/test-error", (req, res, next) => {
  const err = new Error("Intentional error route");
  err.status = 500;
  next(err);
});

const server = http.createServer(app);

if (!isProduction) {
  const [{ default: chokidar }, { WebSocket, WebSocketServer }] = await Promise.all([
    import("chokidar"),
    import("ws"),
  ]);
  const reloadClients = new Set();
  const reloadSocketServer = new WebSocketServer({
    server,
    path: "/live-reload",
  });
  const reloadWatcher = chokidar.watch(
    [
      path.join(__dirname, "views"),
      path.join(__dirname, "src/views"),
      path.join(__dirname, "public"),
    ],
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

app.use((req, res, next) => {
  const err = new Error("Page Not Found");
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  if (res.headersSent || res.finished) {
    return next(err);
  }

  const status = err.status || 500;
  const template = status === 404 ? "404" : "500";
  const context = {
    title: status === 404 ? "Page Not Found" : "Server Error",
    error: NODE_ENV === "production" ? "An error occurred" : err.message,
    stack: NODE_ENV === "production" ? null : err.stack,
  };

  try {
    res.status(status).render(`errors/${template}`, context);
  } catch (renderErr) {
    if (!res.headersSent) {
      res.status(status).send(`<h1>Error ${status}</h1><p>An error occurred.</p>`);
    }
  }
});

server.listen(PORT, host, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
