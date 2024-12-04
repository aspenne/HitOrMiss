'use client';

import { useState } from 'react';
import socket from '../socket';

const AnswerBar = (props) => {
  const [answer, setAnswer] = useState('');
  const roomId = props.roomId;
  const playerId = props.playerId;

  const sendAnswer = () => {
    socket.emit('answer', { answer, playerId, roomId });
    setAnswer('');
  };

    return (
        <div className="fixed left-0 bottom-0 h-2O w-7/12 text-white flex flex-col justify-between shadow-lg p-4 border-t-2 border-white bg-black ">
            <div className="flex items-center flex-row justify-around gap-2">
                <input
                    type="text"
                    className="flex-grow p-2 rounded-md bg-gray-200 border-none focus:outline-none text-black"
                    placeholder="Answer"
                    value={answer}
                    onKeyDown={(e) => { 
                    if (e.key === "Enter") 
                        sendAnswer(); 
                    }} 
                    onChange={(e) => setAnswer(e.target.value)}
                />
                <button

                    onClick={sendAnswer}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md"
                >
                    Guess
                </button>
            </div>
        </div>
    );
};

export default AnswerBar;
