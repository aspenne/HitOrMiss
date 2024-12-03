import { useEffect, useState } from 'react';
import socket from '../socket';

const LeaderBoard = (props) => {
    const roomId = props.roomId;
    const [players, setPlayers] = useState([]);
    const [response, setResponse] = useState('toto'); // La réponse correcte

    useEffect(() => {
        const updatedPlayers = props.players.map(player => ({
            ...player,
            score: 0,
        }));
        setPlayers(updatedPlayers);    
    }, [props.players]);
    
    useEffect(() => {
        socket.on('newAnswer', (answer, playerId) => {
            console.log(answer, playerId);
    
            setPlayers((prevPlayers) =>
                prevPlayers.map((player) => {
                    if (player.playerId === playerId) {
                        const updatedScore = answer === response ? (player.score || 0) + 10 : player.score || 0;
                        return { ...player, answer, score: updatedScore };
                    }
                    return player;
                })
            );
        });
    
        return () => {
            socket.off('newAnswer');
        };
    }, [response]);
    

    return (
        <div className="h-full w-2/12 bg-gray-800 text-white flex flex-col justify-between shadow-lg p-4 border-l-2 border-white">
            <h2 className="text-lg font-bold mb-4"> Room : {roomId} </h2>
            <div className="flex-grow overflow-y-auto bg-gray-700 p-4 rounded-md">
                {players.map((player, index) => (
                    <div 
                        key={index} 
                        className={`p-2 rounded-md mb-2 ${
                            player.answer === response ? 'bg-gray-400' : 'bg-gray-600'
                        }`}
                    >
                        <p> {player.playerName} </p>
                        <small> {player.score} points </small><br />
                        <small>
                        {
                            player.answer !== response ? player.answer : ''
                        }
                        </small>
                    </div>
                ))}
            </div>
            <div className="flex items-center flex-row">
            </div>
        </div>
    );
};

export default LeaderBoard;