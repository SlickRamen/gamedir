import React, { useEffect, useState } from 'react';
import '../resources/css/style.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '../authStore';

function GameDeletePage() {
  const { id } = useParams();
  let gameId = -1;
  if (id) {
    gameId = parseInt(id);
  }

  const [loading, setLoading] = useState(true);
  const [game, setGame] = useState<any>(null);

  const deleteGame = useAuthStore((state) => state.deleteGame);
  const userId = useAuthStore((state) => state.userId);
  const navigate = useNavigate();

  const fetchGame = async () => {
    try {
      const res = await fetch(`http://localhost:4941/api/v1/games/${id}`);
      const data = await res.json();

      // Redirect to the home page if not creator
      if (data.creatorId !== userId) {
        navigate('/'); 
        return;
      }

      setGame(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchGameReviews = async () => {
    try {
      const res = await fetch(`http://localhost:4941/api/v1/games/${id}/reviews`);
      const data = await res.json();

      if (data && data.length > 0) {
        returnToGamePage();
      }
    } catch (err) {
      console.error(err);
    }
  }

  const returnToGamePage = () => navigate(`/game/${id}`);

  const handleDeleteGame = async (e: React.FormEvent) => {
    e.preventDefault();
    await deleteGame(gameId);
    navigate('/');
  };
  

  useEffect(() => {
    fetchGame();
    fetchGameReviews();
  }, [id]);

  return (
    <div className="wrapper">
      <Navbar />

      <div className="page-content">
        { loading ? ( <span className="error-banner">Loading... please wait</span> ) : (
          <div className="row">
            <div className="col w2 clear-on-shrink" />
            <form onSubmit={handleDeleteGame} className="col gap-1 w4">
              <span className="title">Delete {game.title}</span>
              <span>Are you sure you want to delete <span className='game-name-keyword'>{game.title}</span>? This action cannot be undone.</span>
            
              <div className="row">
                <button className="expand" type="button" onClick={returnToGamePage}>No, Cancel</button>
                <button className="expand" type="submit">Yes, Delete</button>
              </div>
            </form>
            <div className="col w2 clear-on-shrink" />
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default GameDeletePage;