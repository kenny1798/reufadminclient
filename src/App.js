import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import { useAuthContext } from './hooks/useAuthContext';
import logo from './component/image/reuf-white.jpg'

import Home from './pages/Home';
import SignIn from './pages/SignIn';
import { useState } from 'react';

function App() {

  const {user} = useAuthContext();
  const location = useLocation();

  return (
    <div className="App">
      <div className='row justify-content-center'>
        <div className='col text-center'>
        <img src={logo} className='' width={150} />
        </div>
      </div>
      <div>
        <Routes>

          <Route path='/' element={!user ? <Navigate to="/signin" state={{from: location}} replace /> : <Home /> } />

          <Route path='/signin' element={user ? <Navigate to="/" state={{from: location}} replace /> : <SignIn /> } />

        </Routes>
      </div>
    </div>
  );
}

export default App;
