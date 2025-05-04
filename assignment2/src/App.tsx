import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GameListPage from './pages/GameListPage';
import GameDetailPage from './pages/GameDetailPage';
import RegisterPage from './pages/RegisterPage';
import SigninPage from './pages/SigninPage';
import CreateGamePage from './pages/CreateGamePage';

function App() {
  
  return (
    <Router>
      <Routes>
        <Route path="/"           element={<GameListPage />} />
        <Route path="/register"   element={<RegisterPage />} />
        <Route path="/signin"     element={<SigninPage />} />
        <Route path="/game/:id"   element={<GameDetailPage />} />
        <Route path="/game/create"   element={<CreateGamePage />} />
      </Routes>
    </Router>
  );
}

export default App;
