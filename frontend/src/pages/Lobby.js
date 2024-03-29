import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BASE_URL } from '../constants';
import './Lobby.css';

const Lobby = () => {
    const [codeBlocks, setCodeBlocks] = useState([]);
    
    useEffect(() => {
        fetch(`${BASE_URL}/code-blocks`)
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