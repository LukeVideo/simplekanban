import "dotenv/config";
import express from "express";
import cors from "cors";
import { router } from "./src/router.js";
import { bodySanitizerMiddleware } from "./src/middlewares/body-sanitizer.js";
import http from "http";

const app = express();

app.use(cors({
  origin: ['https://okanban-nginx-cij8.onrender.com', 'https://okanban-nginx.onrender.com', 'http://localhost:4173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

app.disable('x-powered-by');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodySanitizerMiddleware);

app.get("/health", async (req, res) => {
  try {
    const { sequelize } = require("./model/dbClientSequelize.js");
    await sequelize.authenticate();
    res.status(200).json({ status: "ok", db: "connected" });
  } catch (error) {
    console.error("Health check failed:", error);
    res.status(500).json({ status: "error", error: "DB connection failed" });
  }
});

app.use("/api", router);

const port = process.env.PORT || 10000;
const host = "0.0.0.0";
const server = http.createServer(app);
server.keepAliveTimeout = 65000;
server.headersTimeout = 70000;
server.listen(port, host, () => {
  console.log(`🚀 Server listening at http://${host}:${port}`);
});