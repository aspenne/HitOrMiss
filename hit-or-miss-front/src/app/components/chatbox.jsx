'use client';

import { useEffect, useState } from 'react';
import socket from '../socket';

const Chatbox = (props) => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const roomId = props.roomId;
    const username = props.username;

    useEffect(() => {
        socket.on('newMessage', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => {
            socket.off('newMessage');
        };
    }, []);

    const sendMessage = () => {
        if (message.trim()) {
            socket.emit('chat message', { message, username, roomId });
            setMessage('');
        }
    };

    if (username === null) {
        return <p>Loading chatbox...</p>; // État de chargement initial
    }

    return (
        <div className="h-full w-3/12 bg-gradient-to-t from-black to-slate-800 text-white flex flex-col justify-between shadow-lg p-4 border-l-2 border-white">
            <h2 className="text-lg font-bold mb-4">Chatbox</h2>
            <div className="flex-grow overflow-y-auto mb-4 bg-gray-700 p-4 rounded-md">
                {messages.map((msg, index) => (
                    <p key={index} className="bg-gray-600 p-2 rounded-md mb-2">
                        {msg.username} : {msg.message}
                    </p>
                ))}
            </div>
            <div className="flex items-center flex-row">
                <input
                    type="text"
                    className="flex-grow p-2 rounded-l-md bg-gray-200 border-none focus:outline-none text-black"
                    placeholder="Type your message"
                    value={message}
                    onKeyDown={(e) => { 
                    if (e.key === "Enter") 
                        sendMessage(); 
                    }} 
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button
                    onClick={sendMessage}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-r-md"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default Chatbox;
