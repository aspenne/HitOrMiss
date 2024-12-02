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
    console.log("Un utilisateur est connecté : " + socket.id);

    socket.on("chat message", ({ message, roomId }) => {
      console.log(roomId);
      // Vérifie que le roomId est valide et que des utilisateurs sont connectés dans cette room
      if (rooms[roomId]) {
        // Émettre l'événement newMessage à tous les utilisateurs de la room
        io.to(roomId).emit("newMessage", message);
      } else {
        console.log(
          `La room ${roomId} n'existe pas ou personne n'y est connecté.`
        );
      }
    });

    // Rejoindre une room
    socket.on("joinRoom", ({ roomId, playerId, playerName }) => {
      if (!rooms[roomId]) {
        rooms[roomId] = { players: [], id: roomId };
      }
      socket.join(roomId);
      rooms[roomId].players.push({ id: playerId, name: playerName });
      io.to(roomId).emit("roomUpdate", rooms[roomId]);
      console.log(`${playerName} a rejoint la room ${roomId}`);
    });

    // Quitter une room
    socket.on("leaveRoom", ({ roomId, playerId }) => {
      if (rooms[roomId]) {
        rooms[roomId].players = rooms[roomId].players.filter(
          (player) => player.id !== playerId
        );
        socket.leave(roomId);
        io.to(roomId).emit("roomUpdate", rooms[roomId]);
        console.log(`Un utilisateur a quitté la room ${roomId}`);
      }
    });

    // Gestion de la déconnexion
    socket.on("disconnect", () => {
      console.log("Un utilisateur s'est déconnecté : " + socket.id);
    });
  });
};

export default socket;