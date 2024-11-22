import cors from "cors";
import express from "express";
import { createServer } from "http";
const socket = require("./src/socket.js");

const app = express();

const corsOptions = {
  origin: "http://localhost:3000",
  methods: ["GET", "POST"],
  allowedHeaders: ["my-custom-header"],
  credentials: true,
};

app.use(cors(corsOptions));

const server = createServer(app);
socket(server);

server.listen(3001, () => {
  console.log("Serveur en écoute sur le port 3001");
});
