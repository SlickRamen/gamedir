import React, { useEffect, useState } from 'react';
import defaultProfile from '../resources/img/default-profile.png';

interface Props {
    game: Game;
    size: string;
    refreshKey?: string | number;
}

function GameCover({ game, size, refreshKey }: Props) {
    const [imgSrc, setImgSrc] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (game.gameId !== null) {
            setImgSrc(`/api/v1/games/${game.gameId}/image?${refreshKey ?? Date.now()}`);
        }
    }, [game, refreshKey]);

    const handleImageError = () => {
        setImgSrc(defaultProfile);
    };

    return (
        <img src={imgSrc} className={size} alt={game.title} onError={handleImageError} />
    );
}

export default React.memo(GameCover);
