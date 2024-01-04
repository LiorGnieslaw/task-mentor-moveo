import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import 'highlight.js/styles/atom-one-dark.css';
import { SlActionUndo } from 'react-icons/sl';
import { SocketService } from '../../socket/SocketService';
import './CodeBlock.css';

const CodeBlock = () => {
  const { title } = useParams();
  const [code, setCode] = useState('');
  const [isMentor, setIsMentor] = useState(false);

  hljs.registerLanguage('javascript', javascript);

  const fetchData = async () => { 
    try {
      const response = await fetch(`http://localhost:4000/code/${title}`);
      const data = await response.json();
      const initialCode = data.code || '';
      const { value: highlightedCode } = hljs.highlight('javascript', initialCode);
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

SocketService.init(); 

  useEffect(() => {

    fetchData(); 
    updateMentorFlag();
    
    //This is my try for setting the mentor with the socket and not with local storage.
    
    // SocketService.on('userInfo', ({ isMentor }) => {
    //   setIsMentor(isMentor);
    // });

    SocketService.terminate('codeChange'); 
    SocketService.on("codeChange", ( { title, code } ) => {
      const { value: highlightedCode } = hljs.highlight('javascript', code);
      setCode(highlightedCode);
    });

    SocketService.emit('userJoined', { title });

    return () => {
        SocketService.terminate('codeChange');
    };
  }, []);

  const handleCodeChange = (code) => {
    if (!isMentor) {
      const { value: highlightedCode } = hljs.highlight('javascript', code);
      setCode(highlightedCode);
  
      SocketService.emit('codeChange', { title, code: highlightedCode });
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
                onBlur={(e) => handleCodeChange(e.target.innerText)}
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