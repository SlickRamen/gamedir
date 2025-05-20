import React from "react";
import { Link } from "react-router-dom";
import ProfilePicture from "./ProfilePicture";
import PlatformChip from "./PlatformChip";
import GameCover from "./GameCover";


interface Props {
    game: Game;
    active: boolean;
    progress: number;
}

  
function GameCarouselOption({game, active, progress}: Props) {
    return (
        <div className={`game-card carousel ${active ? 'active' : ''}`}>
            <div className="progress-bar" style={active ? { width: `${progress}%` } : {}}/>
            <GameCover game={game} size={"game-card-carousel-image"}/>
            <div className="game-card-carousel-details">
                <span className="game-card-title-fancy">
                    {game.title}
                </span>
            </div>
        </div>
    );
}

export default React.memo(GameCarouselOption);