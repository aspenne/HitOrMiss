"use client";

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Chatbox from '../../components/chatbox'; // Ton composant Chatbox
import socket from '../../socket';

const QuizRoom = () => {
    const { roomId } = useParams();  // Récupère le roomId de l'URL
    const [players, setPlayers] = useState([]);

    useEffect(() => {
      console.log(roomId);
      socket.emit('joinRoom', {
        roomId: roomId, 
        playerName: localStorage.getItem('name') || 'Anonyme', 
        playerId: uuidv4()
      });
    }, []);

    useEffect(() => {
      socket.on('playerJoinedRoom', (updatedPlayers) => {
          setPlayers(updatedPlayers);
      });

      return () => {
          socket.off('playerJoinedRoom');
      };
    }, []);
    
    return (
        <div className="relative">
            <h1>Room: {roomId}</h1>
            <div>
                <h2>Joueurs dans la room</h2>
                <ul>
                    {players.map(player => (
                        <li key={player.playerId}>{player.playerName}</li>
                    ))}
                </ul>
            </div>

            <Chatbox roomId={roomId}/> 
        </div>
    );
};

export default QuizRoom;
