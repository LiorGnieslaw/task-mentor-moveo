import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import 'highlight.js/styles/atom-one-dark.css';
import { SlActionUndo } from 'react-icons/sl';
import { SocketService } from '../../socket/SocketService';
import { BASE_URL } from '../../constants';
import './CodeBlock.css';

const CodeBlock = () => {
  const { title } = useParams();
  const [code, setCode] = useState('');
  const [solution, setSolution] = useState('');
  const [isMentor, setIsMentor] = useState(false);
  const [isShowSmiley, setIsShowSmiley] = useState(false);

  hljs.registerLanguage('javascript', javascript);

  const fetchData = async () => { 
        try {
          const response = await fetch(`${BASE_URL}/code/${title}`);
          const data = await response.json();
          const initialCode = data.code || '';
          setSolution(data.solution || '');
          const { value: highlightedCode } = hljs.highlight('javascript', initialCode);
          setCode(highlightedCode);
          hljs.highlightAll();
        } catch (error) {
          console.error('Error fetching code block:', error);
        }
    };


  useEffect(() => {
    fetchData(); 
    SocketService.init();
    SocketService.emit('joinCodeBlock', title);

    SocketService.on('mentorConnection', (isMentor) => {
      setIsMentor(isMentor);
    });


    SocketService.on(`getCode`, (newCode) => {
      const { value: highlightedCode } = hljs.highlight('javascript', newCode);
      hljs.highlightAll();
      setCode(highlightedCode);
    });
  
    return () => {
      SocketService.terminate();
    };
  }, []);

  const handleCodeChange = (newCode) => {
    SocketService.emit(`codeChange`, {title, newCode});
    if (newCode === solution) {
      setIsShowSmiley(true);
      setTimeout(() => {
        setIsShowSmiley(false)
      },2000)

    } else {
      setIsShowSmiley(false);
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
            { isShowSmiley && (
                <div className="smiley-face">😊</div>
            )}
            </React.Fragment>
          )}
    </div>
    </React.Fragment>
);
};

export default CodeBlock;