import React from "react";
import { Link } from "react-router-dom";
import ProfilePicture from "./ProfilePicture";
import PlatformChip from "./PlatformChip";
import GameCover from "./GameCover";


interface Props {
    game: Game;
    genre: Genre | undefined;
    platforms: Platform[];
}

function GameCard({ game, genre, platforms }: Props){
    const imageUrl = `/api/v1/games/${game.gameId}/image`;

    const fetchedDate = new Date(game.creationDate);
    const options: Intl.DateTimeFormatOptions = {
        year: '2-digit',
        month: 'numeric',
        day: 'numeric'
    };

    const date: string = fetchedDate.toLocaleDateString(undefined, options);
    return (
        <Link to={`/game/${game.gameId}`} className="game-card">
            <span className="game-card-label">
                <div className="row align-centre">
                    {genre ? genre.name : "No genre"}
                    <span className="game-date float-right">{date}</span>
                </div>
            </span>
            <GameCover game={game} size={"game-card-image"}/>
            <div className="game-card-content">
                <div className="row align-centre">
                    <span className="no-shrink game-card-title-fancy">{game.title}</span>
                    <span className="no-shrink game-card-price float-right">{game.price > 0 ? `$${(game.price / 100).toFixed(2)}` : 'free'}</span>
                </div>
                
                <div className="row align-centre">
                    <ProfilePicture creatorId={game.creatorId} size={"author-icon"}/>
                    <span className="game-author">{game.creatorFirstName} {game.creatorLastName}</span>
                </div>

                <hr/>
                <span className="platform-list unbound row align-centre">
                    <div className="game-platforms align-centre">
                        For 
                        {platforms.map((p) => (
                            <PlatformChip key={p.platformId} platform={p}/>
                        ))}
                    </div>
                </span>
            </div>
        </Link>
    );
}

export default GameCard;