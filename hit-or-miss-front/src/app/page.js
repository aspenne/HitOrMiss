"use client";

import React, { useEffect, useState, useRef } from "react";

export default function Home() {
  const [song, setSong] = useState(null);
  const [error, setError] = useState(null);
  const [guess, setGuess] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const audioRef = useRef(null);

  const fetchSong = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3001/api/song/random");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setSong(data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSong();
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play();
      const timer = setTimeout(() => {
        audioRef.current.pause();
        fetchSong();
      }, 29000); // 29 seconds

      return () => clearTimeout(timer);
    }
  }, [song]);

  const normalizeString = (str) => {
    return str
      .normalize("NFD") // Normalize to decomposed form
      .replace(/[\u0300-\u036f]/g, "") // Remove accents
      .replace(/[\W_]/g, "") // Remove non-word characters (punctuation, spaces, etc.)
      .toLowerCase(); // Convert to lowercase
  };

  const handleGuess = () => {
    if (song) {
      const trackName = normalizeString(song.tracks[0].name);
      const artistName = normalizeString(song.tracks[0].artists[0].name);
      const userGuess = normalizeString(guess);

      if (userGuess === trackName || userGuess === artistName) {
        setResult("Correct!");
      } else {
        setResult("Incorrect. Try again!");
      }
    }
  };

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!song) {
    return <div>No song available</div>;
  }

  const track = song.tracks[0]; // Assurez-vous que la structure des données correspond à celle retournée par l'API

  return (
    <div>
      <h1>Hit or Miss</h1>
      <h2>Blind Test</h2>
      <p>Listen to the song and guess the title or the artist!</p>
      {track.preview_url ? (
        <audio ref={audioRef} controls autoPlay>
          <source src={track.preview_url} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      ) : (
        <p>No preview available</p>
      )}
      <div>
        <input
          type="text"
          placeholder="Enter your guess"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
        />
        <button onClick={handleGuess}>Submit</button>
      </div>
      {result && <p>{result}</p>}
    </div>
  );
}
