import React, { useEffect, useState, useMemo, useRef } from 'react';
import '../resources/css/style.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link, redirect, useNavigate, useParams } from 'react-router-dom';
import ProfilePicture from '../components/ProfilePicture';

import grid from '../resources/img/grid.svg';
import UserReview from '../components/UserReview';
import ReviewInputForm from '../components/ReviewInputForm';
import PlatformChip from '../components/PlatformChip';
import GameCover from '../components/GameCover';
import { useAuthStore } from '../authStore';
import RatingStars from '../components/RatingStars';
import GameCarouselOption from '../components/GameCarouselOption';
import GameHeroOption from '../components/GameHeroOption';
import ReviewPlaceholderForm from '../components/ReviewPlaceholderForm';

function GameDetailPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [canDeleteGame, setCanDeleteGame] = useState(true);

  const [previewGame, setPreviewGame] = useState<Game | null>(null);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalDuration = 10000;

  const [game, setGame] = useState<any>(null);
  const [isOwned, setIsOwned] = useState<boolean>(false)
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false)

  const [similarGames, setSimilarGames] = useState<Game[]>([]);

  const [genres, setGenres] = useState<Genre[]>([]);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [gameGenre, setGameGenre] = useState<Genre>({ genreId: 0, name: '' });
  const [gamePlatforms, setGamePlatforms] = useState<Platform[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  const navigate = useNavigate();
  const userId = useAuthStore((state) => state.userId);
  const token = useAuthStore((state) => state.token);

  const updateIsOwned = async () => {
    if (token) {
      const allGames = await fetch('/api/v1/games?ownedByMe=true', {
            headers: { 'X-Authorization': token },
          });

      const gamesData = await allGames.json();
      const owned = gamesData.games.some((foundGame: { gameId: any; }) => foundGame.gameId === game.gameId);

      setIsOwned(owned);
    }
  }

  const updateIsWishlisted = async () => {
    if (token) {
      const allGames = await fetch('/api/v1/games?wishlistedByMe=true', {
            headers: { 'X-Authorization': token },
          });

      const gamesData = await allGames.json();
      const wishlisted = gamesData.games.some((foundGame: { gameId: any; }) => foundGame.gameId === game.gameId);

      setIsWishlisted(wishlisted);
    }
  }

  const fetchGame = async () => {
    try {
      const res = await fetch(`/api/v1/games/${id}`);
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
      const res = await fetch(`/api/v1/games`);
      const allGames = await res.json();
  
      const filtered = allGames.games.filter((g: Game) => 
        g.gameId !== game.gameId && 
        (g.genreId === game.genreId || g.creatorId === game.creatorId)
      );
  
      setSimilarGames(filtered);
      setPreviewIndex(0);
      setPreviewGame(filtered[0] ?? null);
    } catch (err) {
      console.error("Error fetching similar games:", err);
    }
  };  

  const fetchGenres = async () => {
    try {
      const response = await fetch(`/api/v1/games/genres`);
      const data = await response.json();

      // React elements
      setGenres(data);
    } catch (err) {
      console.error('Error fetching genres:', err);
    }
  };

  const fetchPlatforms = async () => {
    try {
      const response = await fetch(`/api/v1/games/platforms`);
      const data = await response.json();

      // React elements
      setPlatforms(data);
    } catch (err) {
      console.error('Error fetching platforms:', err);
    }
  };


  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/v1/games/${id}/reviews`);
      const data = await res.json();

      if (data && data.length > 0) {
        setCanDeleteGame(false);
      }
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
    fetchReviews();

    return () => {}
  }, [id]);


  const previousGameIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!game) return;

    // Only run when gameId has truly changed
    if (previousGameIdRef.current !== game.gameId) {
        previousGameIdRef.current = game.gameId;
        updateIsOwned();
        updateIsWishlisted();

        fetchSimilarGames();
    }
  }, [game])

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
    if (similarGames.length === 0) return;
  
    const interval = setInterval(() => {
      setElapsedTime((prevElapsed) => {
        if (prevElapsed >= intervalDuration) {
          setPreviewIndex((previewIndex + 1) % similarGames.length)
          return 0;
        }
        return prevElapsed + 100;
      });
    }, 100);
  
    return () => clearInterval(interval);
  }, [similarGames, intervalDuration, previewIndex]);  
  

  useEffect(() => {
    if (similarGames.length > 0) {
      const clampedIndex = previewIndex % similarGames.length;
      setPreviewGame(similarGames[clampedIndex]);
    }
  }, [similarGames, previewIndex]);
   
  
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

  const viewEditPage = () => navigate(`/game/${id}/edit`);
  const viewDeletePage = () => navigate(`/game/${id}/delete`);

  const handlePreviewClick = (ind: number) => {
    setPreviewIndex(ind);
    setElapsedTime(0);
  }

  const toggleOwnedStatus = async (game: Game) => {
    try {
      if (token) {
        if (game.creatorId != userId) {
          const method = (isOwned ? 'DELETE' : 'POST');

          const response = await fetch(`/api/v1/games/${game.gameId}/owned`, {
            method,
            headers: {
              'X-Authorization': token,
            },
          });

          updateIsOwned();
          updateIsWishlisted();
        }
      } else {
        navigate("/signin")
      }
    } catch (error) {
      console.log("Error when trying to toggle owned game: " + error);
    }
  };

  const toggleWishlistStatus = async (game: Game) => {
    try {
      if (token) {
        if (game.creatorId != userId && isOwned === false) {
          const method = (isWishlisted ? 'DELETE' : 'POST');

          const response = await fetch(`/api/v1/games/${game.gameId}/wishlist`, {
            method,
            headers: {
              'X-Authorization': token,
            },
          });

          updateIsWishlisted();
        }
      } else {
        navigate("/signin")
      }
    } catch (error) {
      console.log("Error when trying to toggle wishlisted game: " + error);
    }
  };

  // Reload
  function reloadGameDetails() {  
    fetchReviews();
    fetchGame();
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
                <div className="col w4">
                  <GameCover game={game} size={"game-cover"}/>
                </div>
                <div className="col w0"><span className="vr"></span></div>
                <div className="col w4">
                  <div className="row align-centre">
                    <span className="title">{game.title}</span>
                    { game.creatorId === userId ? (
                      <div className="row align-centre float-right">
                        <button onClick={viewEditPage}>Edit</button>
                        <button onClick={viewDeletePage} disabled={!canDeleteGame}>Delete</button>
                      </div>
                    ) : (
                    <></>
                    )}
                    
                  </div>
                  <img src={grid}></img>
                  <span className="subtitle">{gameGenre.name}</span>
                  <hr/>

                  <div className="game-details">
                    <span className="header">Description</span>
                    <p className="no-margin">{game.description || 'No description provided'}</p>

                    <span className="header">User rating</span>
                    <div className="row align-centre">
                      <RatingStars rating={game.rating}/>
                      <span>{reviews.length > 0 ? (`${game.rating}/10 from ${reviews.length} review(s)`) : 'No rating'}</span>
                    </div>
                    
                    <span className="header">Number of wishlists</span>
                    <span>{game.numberOfWishlists}</span>

                    <span className="header">Number of owners</span>
                    <span>{game.numberOfOwners}</span>

                    <span className="header">Date created</span>
                    <span>{date}</span>

                    <span className="header">Created by</span>
                    <div className="row align-centre">
                        <ProfilePicture creatorId={game.creatorId} size={"details-page-icon"}/>
                        <span className="details-page-author">{ game.creatorId == userId ? (
                          `${game.creatorFirstName} ${game.creatorLastName} (you)`
                        ) : (
                          `${game.creatorFirstName} ${game.creatorLastName}`
                        )}</span>
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
                          <PlatformChip key={p.platformId} platform={p}/>
                      ))}
                    </div>
                  </span>
                </div>

                <div className="buy-option-container">
                  <span className="buy-price">{ game.price > 0 ? `$${(game.price / 100).toFixed(2)}` : 'free to play'}</span>
                  { game.creatorId == userId ? (
                      <button className="buy-button" disabled>Can't mark your own game as owned!</button>
                    ) : (
                      <>
                        <button className="buy-button" onClick={() => toggleOwnedStatus(game)}>{ isOwned ? 'Unmark as owned' : 'Mark as owned'}</button>
                        {isOwned ? (
                          <></>//button className="buy-button" disabled>Can't wishlist game you already own!</button>
                        ) : (
                          <button className="buy-button" onClick={() => toggleWishlistStatus(game)}>{ isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}</button>
                        )}
                      </>
                    ) }
                </div>
              </span>
              
              <span className="title row align-centre">Similar games</span>
                { (similarGames.length === 0 || !previewGame) ? (
                  <span className="error-container">
                    <span className="error-banner">No similar games found</span>
                  </span>
                ) : (
                  <div className="game-container-grid similar-games">
                    {
                      <Link to={`/game/${previewGame.gameId}`} className="current-displayed-game">
                        <GameHeroOption 
                        game={previewGame} 
                        genre={genres.find((g) => g.genreId === game.genreId)}
                        platforms={platforms.filter((p) => game.platformIds.includes(p.platformId))}/>
                      </Link>
                    }
                    <div className="game-list-carousel">
                      {similarGames.map((game, ind) => {
                        const genre = genres.find((g) => g.genreId === game.genreId);
                        const gamePlatforms = platforms.filter((p) => game.platformIds.includes(p.platformId));
                        const progressPercent = (elapsedTime / intervalDuration) * 100;

                        return (
                          <div className="select-carousel-wrapper" key={game.gameId} onClick={() => handlePreviewClick(ind)}>
                            <GameCarouselOption
                              game={game}
                              active={ind === previewIndex}
                              progress={progressPercent}
                              // genre={genre}
                              // platforms={gamePlatforms}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>      
                )}
              <span className="title row align-centre">User reviews</span>
              <span className="subtitle">{reviews.length} review(s)</span>
              <div className="row wide-row collapse">
                <div className="col w5 user-reviews">
                  { reviews.length === 0 ? (
                    <span className="error-banner">No reviews... yet</span> )
                    : ( <>
                      {reviews.map((r) => (
                          <UserReview key={r.reviewerId} review = {r}/>
                      ))}
                    </>)
                  }
                </div>
                <div className="col w3 user-reviews">
                  { userId && userId != game.creatorId ? (
                      <ReviewInputForm game={game} onReviewSubmitted={reloadGameDetails}/> 
                    ) : ( 
                      <ReviewPlaceholderForm userId={userId}/>
                    )
                  }
                </div>
              </div>
            </div>
          ))}
        </div>

        <Footer />
      </div>
    )
}

export default GameDetailPage;