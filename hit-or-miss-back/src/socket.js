import { Server } from "socket.io";

const socket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000", // L'URL du front-end (Next.js)
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true,
    },
  });

  const rooms = {};

  io.on("connection", (socket) => {
    socket.on("chat message", ({ message, username, roomId }) => {
      if (rooms[roomId]) {
        io.to(roomId).emit("newMessage", { message, username });
      }
    });

    // Rejoindre une room
    socket.on("joinRoom", ({ roomId, playerName,  playerId}) => {
      console.log(rooms[roomId]);
      if (!rooms[roomId]) {
        rooms[roomId] = { players: [{playerName, playerId}], id: roomId };
      }
      if (rooms[roomId].players.every((player) => player.playerId !== playerId)){
        rooms[roomId].players.push({ playerName, playerId });
      }
      socket.join(roomId);
      io.to(roomId).emit("roomUpdate", rooms[roomId].players);
    });

    // Quitter une room
    socket.on("leaveRoom", ({ roomId, playerId }) => {
      if (rooms[roomId]) {
        rooms[roomId].players = rooms[roomId].players.filter(
          (player) => player.playerId !== playerId
        );
        socket.leave(roomId);
        io.to(roomId).emit("roomUpdate", rooms[roomId].players);
      }
    });

    socket.on("answer", ({ answer, playerId, roomId }) => {
      console.log(answer, playerId, roomId);
      io.to(roomId).emit("newAnswer", answer, playerId);
    });

    // Gestion de la déconnexion
    socket.on("disconnect", () => {
      console.log("Un utilisateur s'est déconnecté : " + socket.id);
    });

    // Lancer la musique
    socket.on("startMusic", ({ roomId, track }) => {
      io.to(roomId).emit("musicStarted", { track });
    });
  });
};

export default socket;
