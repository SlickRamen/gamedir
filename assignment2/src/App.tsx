import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GameListPage from './pages/GameListPage';
import GameDetailPage from './pages/GameDetailPage';
import RegisterPage from './pages/RegisterPage';
import SigninPage from './pages/SigninPage';
import GameFormCreatePage from './pages/GameFormCreatePage';
import GameFormEditPage from './pages/GameFormEditPage';
import GameDeletePage from './pages/GameDeletePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/"               element={<GameListPage />} />
        <Route path="/register"       element={<RegisterPage />} />
        <Route path="/signin"         element={<SigninPage />} />
        <Route path="/game/:id"       element={<GameDetailPage />} />
        <Route path="/game/create"    element={<GameFormCreatePage />} />
        <Route path="/game/:id/edit"  element={<GameFormEditPage />} />
        <Route path="/game/:id/delete"  element={<GameDeletePage />} />
      </Routes>
    </Router>
  );
}

export default App;
