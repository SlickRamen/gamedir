import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GameListPage from './pages/GameListPage';
import GameDetailPage from './pages/GameDetailPage';

function App() {
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GameListPage />} />
        <Route path="/game/:id" element={<GameDetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;
