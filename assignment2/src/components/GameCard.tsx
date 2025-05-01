
import gameImg from '../resources/img/gameimg.jpeg';
import profilePic from '../resources/img/profile-picture.png';

interface GameCardProps {
    title: string;
    price: string;
}

function GameCard({ title, price }: GameCardProps) {
    return (
        <div className="game-card">
            <span className="game-card-label">hot</span>
            <img src={gameImg} className="game-card-image" alt="Game Image" />
            <div className="game-card-content">
                <span className="game-card-title">{title}</span>
                <span>{price}</span>
            </div>
        </div>
    );
}
  

export default GameCard;