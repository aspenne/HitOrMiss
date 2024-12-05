'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const HomePage = () => {
    const router = useRouter();
    const [roomId, setRoomId] = useState('');
    const [username, setUsername] = useState('');

    const createRoom = () => {
        saveLocalName();
        const newRoomId = Math.random().toString(36).substring(7);          
        router.push(`/room/${newRoomId}`); 
    };

    const saveLocalName = () => {
        localStorage.setItem('name', username);
    }

    const joinRoom = () => {
        saveLocalName();
        localStorage.setItem('name', username);
        localStorage.setItem('playerId', uuidv4());
        router.push(`/room/${roomId}`);
    };

    return (
        <div className="h-[100dvh] w-[100dvw] flex items-center justify-around flex-row bg-gradient-to-t from-black to-slate-800 gap-4">
            <div className='flex flex-col gap-4 items-center'>
                <h2 className='text-4xl text-white'> Create </h2>
                <input
                    type="text"
                    placeholder="Pseudo"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="p-2 border rounded-md text-black"
                />
                <button onClick={createRoom} className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-md text-start w-full">
                    Create a room
                </button>
            </div>
            <div className='h-[100%] w-[1px] bg-white'></div>
            <div className='flex flex-col gap-4 items-center'>
                <h2 className='text-4xl text-white'> Join </h2>
                <input
                    type="text"
                    placeholder="Pseudo"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="p-2 border rounded-md text-black"
                />
                <input
                    type="text"
                    placeholder="ID de la room"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    className="p-2 border rounded-md text-black caret-green-900"
                />
                <button onClick={joinRoom} className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-md w-full">
                    Join a room
                </button>
            </div>
        </div>
    );
};

export default HomePage;
