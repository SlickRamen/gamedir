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
        <>
          { !game ? ( <span className="error-banner">Game not found...</span> )
          : (
                <>
                <GameCover game={game} size={"game-display-image-fill"}/>
                    <div className="game-display-info">
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