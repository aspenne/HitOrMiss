"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import Chatbox from "../../components/chatbox";
import socket from "../../socket";

const QuizRoom = () => {
  const { roomId } = useParams(); // Récupère le roomId de l'URL
  const [players, setPlayers] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    console.log(roomId);
    socket.emit("joinRoom", {
      roomId: roomId,
      playerName: localStorage.getItem("name") || "Anonyme",
      playerId: uuidv4(),
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
    <div className="relative">
      <h1>Room: {roomId}</h1>
      <div>
        <h2>Joueurs dans la room</h2>
        <ul>
          {players.map((player) => (
            <li key={player.playerId}>{player.playerName}</li>
          ))}
        </ul>
      </div>
      <div>
        <h1>Hit or Miss</h1>
        <h2>Blind Test</h2>
        <p>Listen to the song and guess the title or the artist!</p>
        {currentTrack && (
          <audio ref={audioRef} controls autoPlay>
            <source src={currentTrack} type="audio/mp3" />
            Your browser does not support the audio element.
          </audio>
        )}
      </div>
      <Chatbox roomId={roomId} />
    </div>
  );
};

export default QuizRoom;