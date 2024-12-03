"use client";

import AnswerBar from '@/app/components/answerBar';
import Chatbox from '@/app/components/chatbox';
import LeaderBoard from '@/app/components/leaderboard';
import socket from "@/app/socket";
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const QuizRoom = () => {
  const { roomId } = useParams(); // Récupère le roomId de l'URL
  const [currentTrack, setCurrentTrack] = useState(null);
  const audioRef = useRef(null);
  const [username, setUsername] = useState('');
  const [playerId, setPlayerId] = useState('');

    const [players, setPlayers] = useState([{
        playerName: '',
        playerId: ''
    }]);

    useEffect(() => {
        if (typeof window !== 'undefined' && window.localStorage) {
            const storedName = localStorage.getItem('name');
            const storePlayerId = localStorage.getItem('playerId');
            setUsername(storedName || 'Anonyme');
            setPlayerId(storePlayerId || uuidv4());
        }
    }, []);

    useEffect(() => {
        console.log('test', roomId);
        socket.emit('joinRoom', {
            roomId: roomId,
            playerName: localStorage.getItem('name') || 'Anonyme',
            playerId: localStorage.getItem('playerId') || uuidv4()
        });
    }, []);

  useEffect(() => {
    socket.on("playerJoinedRoom", (updatedPlayers) => {
      setPlayers(updatedPlayers);
    });

    return () => {
      socket.off("playerJoinedRoom");
    };
  }, []);

  useEffect(() => {
    fetch("http://localhost:3001/api/song")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched data:", data);
        setCurrentTrack(data.track);
      })
      .catch((error) => console.error("Error fetching track:", error));
  }, []);

  useEffect(() => {
    if (currentTrack && audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error("Failed to play audio:", error);
      });
    }
  }, [currentTrack]);

  return (
    <div className='flex flex-row h-[100dvh]'>
      <div className='w-7/12'>
        <h1>Hit or Miss</h1>
        <h2>Blind Test</h2>
        <p>Listen to the song and guess the title or the artist!</p>
        {currentTrack && (
          <audio ref={audioRef} controls autoPlay>
            <source src={currentTrack} type="audio/mp3" />
            Your browser does not support the audio element.
          </audio>
        )}
        <AnswerBar roomId={roomId} playerId={playerId}></AnswerBar>
      </div>
      <LeaderBoard roomId={roomId} players={players} playerId={playerId}></LeaderBoard>
      <Chatbox roomId={roomId} username={username}/>
    </div>
  );
};

export default QuizRoom;
