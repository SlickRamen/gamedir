import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GameListPage from './pages/GameListPage';
import GameDetailPage from './pages/GameDetailPage';
import RegisterPage from './pages/RegisterPage';
import SigninPage from './pages/SigninPage';
import GameFormCreatePage from './pages/GameFormCreatePage';
import GameFormEditPage from './pages/GameFormEditPage';
import GameDeletePage from './pages/GameDeletePage';
import ScrollToTop from './ScrollToTop';
import MyGamesPage from './pages/MyGamesPage';
import MyProfilePage from './pages/MyProfilePage';

function App() {
  return (
    <Router>
      <ScrollToTop />  {/* Scroll to the top on route change */}
      <Routes>
        <Route path="/"                 element={<GameListPage />} />
        <Route path="/register"         element={<RegisterPage />} />
        <Route path="/signin"           element={<SigninPage />} />
        <Route path="/my-profile"       element={<MyProfilePage />} />
        <Route path="/my-games"         element={<MyGamesPage />} />
        <Route path="/game/:id"         element={<GameDetailPage />} />
        <Route path="/game/create"      element={<GameFormCreatePage />} />
        <Route path="/game/:id/edit"    element={<GameFormEditPage />} />
        <Route path="/game/:id/delete"  element={<GameDeletePage />} />
      </Routes>
    </Router>
  );
}

export default App;
