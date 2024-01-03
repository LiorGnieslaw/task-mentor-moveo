import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import 'highlight.js/styles/atom-one-dark.css';
import io from 'socket.io-client';
import { SlActionUndo } from 'react-icons/sl';
import './CodeBlock.css';

const CodeBlock = () => {
  const { title } = useParams();
  const [code, setCode] = useState('');
  const [isMentor, setIsMentor] = useState(false);
  const socket = io('http://localhost:4000');

  hljs.registerLanguage('javascript', javascript);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:4000/code/${title}`);
        const data = await response.json();

        const initialCode = data.code || '';
        const highlightedCode = hljs.highlight('javascript', initialCode).value;
        setCode(highlightedCode);
        hljs.highlightAll();
      } catch (error) {
        console.error('Error fetching code block:', error);
      }
  };

    const updateMentorFlag = () => {
      try {
        const storedMentorFlag = localStorage.getItem(`${title}-isMentor`);
    
        if (storedMentorFlag === null) {
          localStorage.setItem(`${title}-isMentor`, 'true');
          setIsMentor(true);
        }

      } catch (error) {
        console.error('Error updating mentor flag:', error);
      }
    };

    fetchData(); 
    updateMentorFlag();

    socket.on("codeChange", ( { title, code } ) => {
      console.log('Code change received:', code);
      const highlightedCode = hljs.highlight('javascript', code).value;
      setCode(highlightedCode);
    });

    socket.emit('joinCodeBlock', { title });

    return () => {
      socket.off('codeChange');
    };

  }, [title, code, socket]);

  const handleCodeChange = (code) => {
    if (!isMentor) {
      console.log('Student is changing code:', code);
      const highlightedCode = hljs.highlight('javascript', code).value;
      setCode(highlightedCode);
  
      socket.emit('codeChange', { title, code: highlightedCode });
    }
  };

return (
    <React.Fragment>
    <div className="return-button-container">
      <Link to="/" className="return-button">
        <SlActionUndo />
      </Link>
    </div>
    <div className="code-block-container">
        <h2 className="title-header">{title}</h2>
        {isMentor ? (
        <React.Fragment>
            <h3 className="mode-header">Mentor Mode (Read-only)</h3>
            <div className="code-container">
                <code className="highlighted-code"
                dangerouslySetInnerHTML={{ __html: code }}
                />
            </div>
        </React.Fragment>
          ) : (
            <React.Fragment>
            <h3 className="mode-header">Student Mode</h3>
            <div className="code-container">
                <code className="highlighted-code"
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => handleCodeChange(e.target.textContent)}
                dangerouslySetInnerHTML={{ __html: code }}
                />
            </div>
            </React.Fragment>
          )}
    </div>
    </React.Fragment>
);
};

export default CodeBlock;