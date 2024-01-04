import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { SocketService } from '../socket/SocketService';

import './Lobby.css';

const Lobby = () => {
    const [codeBlocks, setCodeBlocks] = useState([]);

    useEffect(() => {
        fetch('http://localhost:4000/code-blocks')
        .then(response => response.json())
        .then(data => setCodeBlocks(data))
        .catch(error => console.error('Error fetching code block titles:', error));
    }, []);
        
    return (
        <div className='lobby-container'>
            <h1>Choose Code Block</h1>
            {codeBlocks.map((codeBlock) => (
            <Link 
            key={codeBlock.title}
            to={`/code-block/${codeBlock.title}`}
            className="code-block-link"
            >
                {codeBlock.title}
            </Link>
            ))}
        </div>
    );
};

export default Lobby;