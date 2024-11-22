import cors from "cors";
import express from "express";
import { createServer } from "http";
import socket from "./src/socket.js"; // Utilisez l'importation par défaut
import songRoutes from './src/routes/song.js'; // Utilisez l'importation par défaut

const app = express();

const corsOptions = {
  origin: "http://localhost:3000",
  methods: ["GET", "POST"],
  allowedHeaders: ["my-custom-header"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use('/api/song', songRoutes);

const server = createServer(app);
socket(server);

server.listen(3001, () => {
  console.log("Serveur en écoute sur le port 3001");
});