import './App.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import React from 'react';

import { AiOutlineHistory } from 'react-icons/ai'

import Finances from './modules/Finances/Finances';
import History from './modules/History/History';

function App() {
  return (
    <div>
      <BrowserRouter>
        <div>
          <div className='navbar'>
            <Link to={'/'} className='home'>Finantials</Link>
            <Link to={'/history'} className='header-icon'><AiOutlineHistory /></Link>
          </div>
          <Routes>
            <Route exact path='/' element={<Finances />} />
            <Route exact path='/history' element={<History />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
