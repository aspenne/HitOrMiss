import cors from 'cors';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();

const corsOptions = {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
};

app.use(cors(corsOptions));

const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // L'URL du front-end (Next.js)
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
});


const rooms = {};

io.on('connection', (socket) => {
    console.log('Un utilisateur est connecté : ' + socket.id);

    socket.on('chat message', ({message, roomId}) => {
        console.log(roomId);
        // Vérifie que le roomId est valide et que des utilisateurs sont connectés dans cette room
        if (rooms[roomId]) {
            // Émettre l'événement newMessage à tous les utilisateurs de la room
            io.to(roomId).emit('newMessage', message);
        } else {
            console.log(`La room ${roomId} n'existe pas ou personne n'y est connecté.`);
        }
    });


    // Rejoindre une room
    socket.on('joinRoom', ({ roomId, playerId, playerName}) => {
    if (!rooms[roomId]) {
            rooms[roomId] = { players: [], id : roomId};
        }
        rooms[roomId].players.push({ playerId, playerName });

        socket.join(roomId);
        
        io.to(roomId).emit('playerJoinedRoom', rooms[roomId].players);        
        console.log(rooms);
        console.log(rooms[roomId])
    });
    

    // Quitter une room
    socket.on('leaveRoom', ({ roomId, username }) => {
        if (rooms[roomId]) {
            rooms[roomId].players = rooms[roomId].players.filter(player => player.id !== socket.id);
            socket.leave(roomId);

            // Envoyer une mise à jour à tous les clients dans la room
            io.to(roomId).emit('roomUpdate', rooms[roomId]);

            console.log(`${username} a quitté la room ${roomId}`);
        }
    });

    // Gestion de la déconnexion
    socket.on('disconnect', () => {
        console.log('Un utilisateur s\'est déconnecté : ' + socket.id);
    });
});


server.listen(3001, () => {
    console.log('Serveur en écoute sur le port 3001');
});
