"use client";

import { useEffect, useState } from 'react';
import socket from '../socket';

const Chatbox = (props) => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const roomId = props.roomId;
    

    useEffect(() => {
        socket.on('newMessage', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });
        console.log(messages);

        return () => {
            socket.off('newMessage');
        };
    }, []);

    const sendMessage = () => {
        if (message.trim()) {
            socket.emit('chat message', {message, roomId});
            setMessage(''); 
        }
    };

    return (
        <div className="fixed right-0 top-0 h-full w-1/4 bg-gray-800 text-white flex flex-col justify-between shadow-lg p-4">
            <h2 className="text-lg font-bold mb-4">Chatbox</h2>
            <div className="flex-grow overflow-y-auto mb-4 bg-gray-700 p-4 rounded-md">
                {messages.map((msg, index) => (
                    <p key={index} className="bg-gray-600 p-2 rounded-md mb-2">Message {index + 1}: {msg}</p>
                ))}
            </div>
            <div className="flex items-center flex-col">
                <input
                    type="text"
                    className="flex-grow p-2 rounded-l-md bg-gray-600 border-none focus:outline-none"
                    placeholder="Type your message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button
                    onClick={sendMessage}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-r-md">
                    Send
                </button>
            </div>
        </div>
    );
};

export default Chatbox;
