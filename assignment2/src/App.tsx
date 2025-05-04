import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GameListPage from './pages/GameListPage';
import GameDetailPage from './pages/GameDetailPage';
import RegisterPage from './pages/RegisterPage';
import SigninPage from './pages/SigninPage';

function App() {
  
  return (
    <Router>
      <Routes>
        <Route path="/"           element={<GameListPage />} />
        <Route path="/register"   element={<RegisterPage />} />
        <Route path="/signin"     element={<SigninPage />} />
        <Route path="/game/:id"   element={<GameDetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;
