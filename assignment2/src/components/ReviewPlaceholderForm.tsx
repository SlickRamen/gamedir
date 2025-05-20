
interface Props {
    userId: number | null;
}

function ReviewPlaceholderForm({ userId } : Props) {
    return (
        <div className="user-create-review">
            <div className="game-card-content">
                <span className="subtitle">Unable to review this game</span>
                <br></br>
                { userId ? (
                    'You created this game, so are unable to review it!'
                ) : (
                    'You must be signed in to leave a review!'
                ) }
                
            </div>
        </div>
    );
}
  

export default ReviewPlaceholderForm;