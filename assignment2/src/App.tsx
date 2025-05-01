import React, { useEffect, useState } from 'react';
import './resources/css/style.css';
import Navbar from './components/Navbar';
import GameCard from './components/GameCard';
import SearchBar from './components/SearchBar';
import Footer from './components/Footer';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [submittedSearchTerm, setSubmittedSearchTerm] = useState('');

  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const [resultsCount, setResultsCount] = useState(0);

  const fetchGames = async (searchQuery: string="") => {
    setLoading(true); // Start loading
    try {
      const response = await fetch(`http://localhost:4941/api/v1/games?${searchQuery != '' ? `q=${searchQuery}` : ''}`);
      const data = await response.json();

      // React elements
      setGames(data.games);
      setResultsCount(data.count);
    } catch (error) {
      console.error('Error fetching games:', error);
    } finally {
      setLoading(false); // End loading
    }
  };

  // Default
  useEffect(() => {
    fetchGames();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedSearchTerm(searchTerm);
    fetchGames(searchTerm);
  };

  return (
    <>
      <div className="wrapper">
        <Navbar />

        <div className="page-content">
          <span className="title">{submittedSearchTerm ? `results for '${submittedSearchTerm}'` : 'explore games'}</span>
          <span className="subtitle">{resultsCount} results found</span>

          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onSearchSubmit={handleSearchSubmit}
          />

          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="game-container-grid">
              {games.map((game) => (
                <GameCard
                  key={game.gameId}
                  game={game}
                />
              ))}
            </div>
          )}
        </div>

        <Footer />
      </div>
    </>
  );
}

export default App;
