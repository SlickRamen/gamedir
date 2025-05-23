import React, { useEffect, useState, useMemo } from 'react';
import '../resources/css/style.css';
import Navbar from '../components/Navbar';
import GameCard from '../components/GameCard';
import Footer from '../components/Footer';
import { useAuthStore } from '../authStore';
import { useNavigate } from 'react-router-dom';

function MyGamesPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);
  const [resultsCount, setResultsCount] = useState(0);

  const userId = useAuthStore((state) => state.userId);
  const token = useAuthStore((state) => state.token);

  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      navigate("/");
    }
  }, [userId, navigate]);
  
  const fetchGames = async () => {
    setLoading(true); // Start loading

    if (token) {
      try {
        const [createdRes, wishlistedRes, ownedRes, reviewedRes] = await Promise.all([
          fetch(`http://localhost:4941/api/v1/games?creatorId=${userId}`),
          fetch('http://localhost:4941/api/v1/games?wishlistedByMe=true', {
            headers: { 'X-Authorization': token },
          }),
          fetch(`http://localhost:4941/api/v1/games?ownedByMe=true`, {
            headers: { 'X-Authorization': token },
          }),
          fetch(`http://localhost:4941/api/v1/games?reviewerId=${userId}`),
        ]);

        const [createdData, wishlistedData, ownedData, reviewedData] = await Promise.all([
          createdRes.json(),
          wishlistedRes.json(),
          ownedRes.json(),
          reviewedRes.json(),
        ]);

        const combinedGames = [
          ...createdData.games,
          ...wishlistedData.games,
          ...ownedData.games,
          ...reviewedData.games,
        ];

        // Get a set of games (remove duplicates)
        const uniqueGamesMap = new Map();
        combinedGames.forEach(game => {
          uniqueGamesMap.set(game.gameId, game);
        });

        const uniqueGames = Array.from(uniqueGamesMap.values());
        setGames(uniqueGames);
        setResultsCount(uniqueGames.length);
      } catch (error) {

        console.error('Error fetching games:', error);
      } finally {
        setLoading(false); // End loading
      }
    }
  };


  const fetchGenres = async () => {
    try {
      const response = await fetch(`http://localhost:4941/api/v1/games/genres`);
      const data = await response.json();
      
      setGenres(data);
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };

  const fetchPlatforms = async () => {
    try {
      const response = await fetch(`http://localhost:4941/api/v1/games/platforms`);
      const data = await response.json();

      setPlatforms(data);
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

  return (
      <div className="wrapper">
        <Navbar />

        <div className="page-content">
          <span className="title">My games</span>
          <hr/>
          <div className="row">
            <span className="subtitle">{resultsCount} result(s)</span>
          </div>
          {loading ? (
            <span className="error-banner">Loading... please wait</span>  
          ) : games.length === 0 ? (
            <span className="error-banner">No results found.</span>
          ) : (
            <>
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
            </>
          )}
        </div>

        <Footer />
      </div>
    )
}

export default MyGamesPage