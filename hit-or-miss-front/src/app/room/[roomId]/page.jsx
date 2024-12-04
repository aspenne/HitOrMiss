"use client";

import AnswerBar from "@/app/components/answerBar";
import Chatbox from "@/app/components/chatbox";
import LeaderBoard from "@/app/components/leaderboard";
import socket from "@/app/socket";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const QuizRoom = () => {
  const { roomId } = useParams(); // Récupère le roomId de l'URL
  const [currentTrack, setCurrentTrack] = useState(null);
  const [artist, setArtist] = useState(null);
  const [song, setSong] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const audioRef = useRef(null);
  const [username, setUsername] = useState("");
  const [playerId, setPlayerId] = useState("");

  const [players, setPlayers] = useState([
    {
      playerName: "",
      playerId: "",
    },
  ]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const storedName = localStorage.getItem("name");
      const storePlayerId = localStorage.getItem("playerId");
      setUsername(storedName || "Anonyme");
      setPlayerId(storePlayerId || uuidv4());
    }
  }, []);

    useEffect(() => {
        const handleBeforeUnload = () => {
          socket.emit("leaveRoom", { roomId: roomId, playerId: playerId });
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
          window.removeEventListener("beforeunload", handleBeforeUnload);
        };
      }, [roomId, playerId]);

  useEffect(() => {
    socket.emit("joinRoom", {
      roomId: roomId,
      playerName: localStorage.getItem("name") || "Anonyme",
      playerId: localStorage.getItem("playerId") || uuidv4(),
    });
  }, []);

  useEffect(() => {
    socket.on("roomUpdate", (updatedPlayers) => {
      setPlayers(updatedPlayers);
    });

    return () => {
      socket.off("roomUpdate");
    };
  }, []);

  useEffect(() => {
    const handleMusicStarted = async (data) => {
      setCurrentTrack(data.track);
      setArtist(data.artist);
      setSong(data.song);
      setPlaying(true);
      if (audioRef.current) {
        try {
          await audioRef.current.play();
        } catch (error) {
          console.error("Failed to play audio:", error);
        }
      }
    };

    socket.on("musicStarted", handleMusicStarted);

    return () => {
      socket.off("musicStarted", handleMusicStarted);
    };
  }, []);

  useEffect(() => {
    socket.on("changeTrack", (data) => {
      setShowAnswer(false);
      setCurrentTrack(data.track);
      setArtist(data.artist);
      setSong(data.song);
    });

    return () => {
      socket.off("changeTrack");
    };
  }, []);

  useEffect(() => {
    socket.on("showAnswer", () => {
      setShowAnswer(true);
    });

    socket.on("stopMusic", () => {
      setShowAnswer(false);
      setPlaying(false);
      setCurrentTrack(null);
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    });
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
      audioRef.current.play();
    }
  }, [currentTrack]);

  const retrieveTrack = () => {
    fetch("http://localhost:3001/api/song")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        socket.emit("startMusic", { roomId, track: data.track });
      })
      .catch((error) => console.error("Error fetching track:", error));
  };

  return (
    <section className="flex items-center justify-center h-screen bg-gray-800 text-white">
      <div className="w-7/12 text-center">
        {showAnswer && artist!=null && song!=null && (
          <div className="bg-gray-700 p-4 rounded-md mb-4">
            <p className="text-sm">
              Answer: {song} - {artist}
            </p>
          </div>
        )}
        <h1 className="text-3xl font-bold mb-4">Hit or Miss</h1>
        <h2 className="text-xl font-bold mb-4">Blind Test</h2>
        <p className="text-sm mb-4">
          Listen to the song and guess the title or the artist!
        </p>
        {!playing && (
          <button
            onClick={retrieveTrack}
            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md"
          >
            Start Music
          </button>
        )}
        {currentTrack && playing && (
          <div>
            <audio className="hidden" ref={audioRef} controls autoPlay>
              <source src={currentTrack} type="audio/mp3" />
              Your browser does not support the audio element.
            </audio>
            <div className="flex items-center space-x-4">
              <label htmlFor="volume" className="text-sm">
                Volume:
              </label>
              <input
                id="volume"
                type="range"
                min="0"
                max="1"
                step="0.1"
                defaultValue="0.5"
                onChange={(e) => (audioRef.current.volume = e.target.value)}
                className="w-32 h-1 bg-blue-500 rounded-lg appearance-none"
              />
            </div>
            <AnswerBar roomId={roomId} playerId={playerId}></AnswerBar>
          </div>
        )}
      </div>

      <LeaderBoard
        roomId={roomId}
        players={players}
        playerId={playerId}
      ></LeaderBoard>
      <Chatbox roomId={roomId} username={username} />
    </section>
  );
};

export default QuizRoom;
