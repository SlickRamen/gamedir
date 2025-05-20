import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProfilePicture from "./ProfilePicture";
import PlatformChip from "./PlatformChip";
import GameCover from "./GameCover";
import grid from '../resources/img/grid.svg';
import { useAuthStore } from "../authStore";


interface Props {
    game: Game | null;
    genre: Genre | undefined;
    platforms: Platform[];
}

function GameHeroOption({ game, genre, platforms }: Props){
    const userId = useAuthStore((state) => state.userId);
    const [refreshState, setRefreshState] = useState(false);
    const [fadeIn, setFadeIn] = useState(false); 

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

    useEffect(() => {
        if (game) {
            setFadeIn(false); // Reset fade-in state before triggering fade-in
            setTimeout(() => setFadeIn(true), 50); // Delay to allow DOM updates before fading in
        }
    }, [game]); // Trigger fade-in effect when the game changes

    return (
        <>
          { !game ? ( <span className="error-banner">Game not found...</span> )
          : (
                <>
                <GameCover game={game} 
                        size={fadeIn ? "game-display-image-fill invisible fade-in" : "game-display-image-fill invisible"}/>
                    <div className={fadeIn ? "game-display-info invisible fade-in" : "game-display-info invisible"}>
                        <span className="title game-card-title-fancy">
                            {game.title}
                        </span>
                        {genre ? genre.name : "No genre"}

                        <hr/>

                        <span className="header">Price</span>
                        <span className="no-shrink">{game.price > 0 ? `$${(game.price / 100).toFixed(2)}` : 'free'}</span>

                        <span className="header">Created on</span>
                        {date}

                        <span className="header">Created by</span>
                        <div className="row align-centre">
                            <ProfilePicture creatorId={game.creatorId} size={"author-icon"}/>
                            <span className="details-page-author">{ game.creatorId == userId ? (
                                `${game.creatorFirstName} ${game.creatorLastName} (you)`
                            ) : (
                                `${game.creatorFirstName} ${game.creatorLastName}`
                            )}</span>
                        </div>

                        
                        <span className="header">Platforms</span>
                        <span className="platform-list unbound row align-centre">
                            <div className="game-platforms align-centre">
                                {platforms.map((p) => (
                                    <PlatformChip key={p.platformId} platform={p}/>
                                ))}
                            </div>
                        </span>
                    </div>
                </>
            )}
        </>

    );
}

export default GameHeroOption;