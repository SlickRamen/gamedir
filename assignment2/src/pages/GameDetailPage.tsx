import React, { useEffect, useState, useMemo } from 'react';
import '../resources/css/style.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useParams } from 'react-router-dom';
import ProfilePicture from '../components/ProfilePicture';

import grid from '../resources/img/grid.svg';
import UserReview from '../components/UserReview';
import PlatformChip from '../components/PlatformChip';
import GameCard from '../components/GameCard';

function GameDetailPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  const [game, setGame] = useState<any>(null);
  const [similarGames, setSimilarGames] = useState<Game[]>([]);

  const [genres, setGenres] = useState<Genre[]>([]);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [gameGenre, setGameGenre] = useState<Genre>({ genreId: 0, name: '' });
  const [gamePlatforms, setGamePlatforms] = useState<Platform[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  const fetchGame = async () => {
    try {
      const res = await fetch(`http://localhost:4941/api/v1/games/${id}`);
      const data = await res.json();
      setGame(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSimilarGames = async () => {
    try {
      const res = await fetch(`http://localhost:4941/api/v1/games`);
      const allGames = await res.json();
  
      const filtered = allGames.games.filter((g: Game) => 
        g.gameId !== game.gameId && 
        (g.genreId === game.genreId || g.creatorId === game.creatorId)
      );
  
      setSimilarGames(filtered);
    } catch (err) {
      console.error("Error fetching similar games:", err);
    }
  };  

  const fetchGenres = async () => {
    try {
      const response = await fetch(`http://localhost:4941/api/v1/games/genres`);
      const data = await response.json();

      // React elements
      setGenres(data);
      console.log(data);
    } catch (err) {
      console.error('Error fetching genres:', err);
    }
  };

  const fetchPlatforms = async () => {
    try {
      const response = await fetch(`http://localhost:4941/api/v1/games/platforms`);
      const data = await response.json();

      // React elements
      setPlatforms(data);
      console.log(data);
    } catch (err) {
      console.error('Error fetching platforms:', err);
    }
  };


  const fetchReviews = async () => {
    try {
      const res = await fetch(`http://localhost:4941/api/v1/games/${id}/reviews`);
      const data = await res.json();
      setReviews(data);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    }
  };  

  // Default
  useEffect(() => {
    fetchGenres();
    fetchGame();
    fetchPlatforms();
    fetchReviews()
  }, [id]);

  useEffect(() => {
    if (genres.length > 0 && game) {
      const genre = genres.find((g) => g.genreId === game.genreId);

      if (genre) {
        setGameGenre(genre);
      } else {
        console.warn("Genre not found for game");
      }
    }
  }, [genres, game]);


  useEffect(() => {
    if (platforms.length > 0 && game) {
      const platformList = platforms.filter((p) => game.platformIds.includes(p.platformId));
      
      setGamePlatforms(platformList);
    }
  }, [platforms, game]);

  useEffect(() => {
    if (game) {
      fetchSimilarGames();
    }
  }, [game]); 

  let date: string = "Loading"
  
  if (game) {
    const fetchedDate = new Date(game.creationDate);
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    date = fetchedDate.toLocaleDateString(undefined, options);
  }

  return (
      <div className="wrapper">
        <Navbar />

        <div className="page-content">
          <br/>

          { loading ? ( <span className="error-banner">Loading... please wait</span> )
          : ( !game ? ( <span className="error-banner">Game not found...</span> )
          : (
            <div className="col">
              <div className="row">
                <div className="col w3">
                  <img className="game-cover" src={`http://localhost:4941/api/v1/games/${id}/image`} alt={game.title} />  
                </div>
                <div className="col w0"><span className="vr"></span></div>
                <div className="col w5">
                  <span className="title">{game.title}</span>
                  <img src={grid}></img>
                  <span className="subtitle">{gameGenre.name}</span>
                  <hr/>

                  <div className="game-details">
                    <span className="header">Description</span>
                    <p className="no-margin">{game.description || 'No description provided'}</p>

                    <span className="header">User rating</span>
                    <span>{`${game.rating}/10 from ${reviews.length} review(s)` || 'N/A'}</span>

                    <span className="header">Date created</span>
                    <span>{date}
                    </span>

                    <span className="header">Created by</span>
                    <div className="row align-centre">
                        <ProfilePicture creatorId={game.creatorId} size={"details-page-icon"}/>
                        <span className="details-page-author">{game.creatorFirstName} {game.creatorLastName}</span>
                    </div>
                  </div>
                </div>
              </div>

              <br/>

              <span className="buy-cta">
                <div className="col">
                  Buy {game.title}
                  <span className="platform-list row align-centre">
                    <div className="game-platforms align-centre">
                      Available for
                      {gamePlatforms.map((p) => (
                          <PlatformChip platform={p}/>
                      ))}
                    </div>
                  </span>
                </div>
                <div className="buy-option-container">
                  <span className="buy-price">{ game.price > 0 ? `$${(game.price / 100).toFixed(2)}` : 'free to play'}</span>
                    <button className="buy-button">Buy now</button>
                </div>
              </span>
              
              <span className="title row align-centre">Similar games</span>
                {similarGames.length === 0 ? (
                  <span className="error-container">
                    <span className="error-banner">No similar games found</span>
                  </span>
                ) : (
                  <div className="game-container-grid similar-games">
                    {similarGames.map((game) => {
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
              <span className="title row align-centre">User reviews</span>
              <span className="subtitle">{reviews.length} review(s)</span>
              <div className="user-reviews">
                { reviews.length === 0 ? (
                  <span className="error-banner">No reviews... yet</span> )
                  : ( <>
                    {reviews.map((r) => (
                        <UserReview review = {r}/>
                    ))}
                  </>)
                }
              </div>
            </div>
          ))}
        </div>

        <Footer />
      </div>
    )
}

export default GameDetailPage;