import React, { useEffect, useState, useMemo } from 'react';
import '../resources/css/style.css';
import Navbar from '../components/Navbar';
import GameCard from '../components/GameCard';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import Footer from '../components/Footer';

function GameListPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [submittedSearchTerm, setSubmittedSearchTerm] = useState('');

  const [games, setGames] = useState<Game[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);
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


  const fetchGenres = async () => {
    try {
      const response = await fetch(`http://localhost:4941/api/v1/games/genres`);
      const data = await response.json();

      // React elements
      setGenres(data);
      console.log(data);
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };



  const fetchPlatforms = async () => {
    try {
      const response = await fetch(`http://localhost:4941/api/v1/games/platforms`);
      const data = await response.json();

      // React elements
      setPlatforms(data);
      console.log(data);
    } catch (error) {
      console.error('Error fetching platforms:', error);
    }
  };

  // Default
  useEffect(() => {
    fetchGenres();
    fetchGames();
    fetchPlatforms();
  }, []);


  const genreMap = useMemo(() => {
    const map: Record<number, string> = {};
    genres.forEach((g) => {
      map[g.genreId] = (g.genreId, g.name);
    });
    return map;
  }, [genres]);

  const platformMap = useMemo(() => {
    const map: Record<number, string> = {};
    platforms.forEach((p) => {
      map[p.platformId] = p.name;
    });
    return map;
  }, [platforms]);


  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedSearchTerm(searchTerm);
    fetchGames(searchTerm);
  };

  return (
      <div className="wrapper">
        <Navbar />

        <div className="page-content">
          <span className="title">Explore games</span>
          
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onSearchSubmit={handleSearchSubmit}
          />
          <FilterBar/>

          <hr/>
          <span className="subtitle">{resultsCount} result(s) {submittedSearchTerm != '' ? `for '${submittedSearchTerm}'` : ''}</span>
          {loading ? (
            <p>Loading...</p>
          ) : games.length === 0 ? (
            <span className="error-banner">No results found.</span>
          ) : (
              <div className="game-container-grid">
                {games.map((game) => {
                  const genre = genres.find((g) => g.genreId === game.genreId);
                  const gamePlatforms = platforms.filter((p) => game.platformIds.includes(p.platformId));

                  return (
                    <GameCard
                      key={game.gameId}
                      game={game}
                      genre={genre}
                      platforms={gamePlatforms}
                    />
                  );
                })}
              </div>
          )}
        </div>

        <Footer />
      </div>
    )
}

export default GameListPage