
import profilePic from '../resources/img/profile-picture.png';

interface GameCardProps {
    game: Game;
}

function GameCard({ game }: GameCardProps) {
    const imageUrl = `http://localhost:4941/api/v1/games/${game.gameId}/image`;
    return (
        <div className="game-card">
            {/* <span className="game-card-label">hot</span> */}
            <img src={imageUrl} className="game-card-image" alt="Game Image" />
            <div className="game-card-content">
                <span className="game-card-title">{game.title}</span>
                <span>{game.price > 0 ? `$${(game.price / 100).toFixed(2)}` : 'free to play'}</span>
            </div>
        </div>
    );
}
  

export default GameCard;