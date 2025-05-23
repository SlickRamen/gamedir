import React, { useEffect, useState } from 'react';
import GameFormPage, { GameFormData } from './GameFormPage';
import { useParams, useNavigate, redirect } from 'react-router-dom';
import { useAuthStore } from '../authStore';

function GameFormEditPage() {
  const { id } = useParams();
  let gameId = -1;
  if (id) {
    gameId = parseInt(id);
  }

  const userId = useAuthStore((state) => state.userId);

  const updateGame = useAuthStore((state) => state.editGame);
  const [initialData, setInitialData] = useState<GameFormData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGame = async () => {
      if (!gameId) return;


      if (!userId) {
        navigate("/");
        return;
      }

      const res = await fetch(`http://localhost:4941/api/v1/games/${gameId}`);
      const data = await res.json();
      
      // Redirect to the home page if not creator
      if (data.creatorId !== userId) {
        navigate('/'); 
        return;
      }

      setInitialData({
        title: data.title,
        description: data.description,
        genreId: data.genreId,
        platformIds: data.platformIds,
        price: data.price,
        image: null,
      });
    };

    fetchGame();
  }, [gameId]);

  const handleUpdate = async (data: any) => {
    await updateGame(gameId, data);
    navigate(`/game/${id}`);
  };

  if (!initialData) return <span className="error-banner">Loading... please wait</span>;

  return <GameFormPage initialData={initialData} onSubmit={handleUpdate} mode="edit" />;
}

export default GameFormEditPage;
