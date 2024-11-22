"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';

const HomePage = () => {
    const router = useRouter();
    const [roomId, setRoomId] = useState('');
    const [username, setUsername] = useState('');

    const createRoom = () => {
        const newRoomId = Math.random().toString(36).substring(7);          
        router.push(`/room/${newRoomId}`); 
    };

    const saveLocalName = () => {
        localStorage.setItem('name', username);
    }

    const joinRoom = () => {
        router.push(`/room/${roomId}`);
    };

    return (
        <div className="p-4">
            <h1>Bienvenue au Quiz Game</h1>
            <button onClick={createRoom} className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md">
                Créer une nouvelle room
            </button>

            <div className="mt-4">
                <input
                    type="text"
                    placeholder="Pseudo"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="p-2 border rounded-md"
                />
                <button onClick={saveLocalName} className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-md ml-2">
                    Save name
                </button>
            </div>

            <div className="mt-4">
                <input
                    type="text"
                    placeholder="ID de la room"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    className="p-2 border rounded-md"
                />
                <button onClick={joinRoom} className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-md ml-2">
                    Rejoindre la room
                </button>
            </div>
        </div>
    );
};

export default HomePage;
