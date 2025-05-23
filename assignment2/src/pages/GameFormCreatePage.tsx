import React, { useEffect } from 'react';
import GameFormPage from './GameFormPage';
import { useAuthStore } from '../authStore';
import { useNavigate } from 'react-router-dom';

function GameFormCreatePage() {
  const createGame = useAuthStore((state) => state.createGame);
  const navigate = useNavigate();

  const userId = useAuthStore((state) => state.userId);

  useEffect(() => {
    if (!userId) {
      navigate("/");
    }
  }, [userId, navigate]);

  const handleCreate = async (data: any) => {
    await createGame(data);
    navigate('/');
  };

  return <GameFormPage onSubmit={handleCreate} />;
}

export default GameFormCreatePage;
