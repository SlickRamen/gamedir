import React from 'react';
import './resources/css/style.css';
import Navbar from './components/Navbar';
import GameCard from './components/GameCard';

function App() {
  const fillerGames = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    title: `Game ${i + 1}`,
    price: `$20`,
  }));

  return (
    <>
      <div className="wrapper">
        <Navbar />
        <div className="page-content">
          <span className="title">explore games</span>
          <div className="game-container-grid">
            {fillerGames.map((game) => (
              <GameCard
                key={game.id}
                title={game.title}
                price={game.price}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
