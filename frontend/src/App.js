import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Lobby from './pages/Lobby';
import CodeBlock from './components/codeblock/CodeBlock';
import Header from './components/header/Header';
import './App.css';

const App = () => {
  return (
    <Router>
      <Header/>
      <div className='app-container'>
        <Routes>
          <Route path="/" exact element={<Lobby />} />
          <Route path="/code-block/:title" element={<CodeBlock />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;