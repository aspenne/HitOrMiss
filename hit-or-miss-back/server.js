import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import socket from './src/socket.js';
import songRoutes from './src/routes/song.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const corsOptions = {
  origin: "http://localhost:3000",
  methods: ["GET", "POST"],
  allowedHeaders: ["my-custom-header"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use('/api/song', songRoutes);

app.use('/tracks', express.static(path.join(__dirname, '/tracks')));

const server = createServer(app);
socket(server);

server.listen(3001, () => {
  console.log("Serveur en écoute sur le port 3001");
});