import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProfilePicture from "./ProfilePicture";
import RatingStars from "./RatingStars";
import { useAuthStore } from "../authStore";

interface Props {
    game: Game;
    onReviewSubmitted: () => void;
}

function ReviewInputForm({ game, onReviewSubmitted} : Props) {
    const userId = useAuthStore((state) => state.userId);
    const token = useAuthStore((state) => state.token);

    const [rating, setRating] = useState<number>(0);
    const [review, setReview] = useState<string>("");

    const submitReview = async () => {
        if (!userId || !token) return alert("You must be logged in to submit a review.");
        if (rating < 1 || rating > 10) return alert("Rating must be between 1 and 10.");
        
        try {
            const res = await fetch(`/api/v1/games/${game.gameId}/reviews`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Authorization": token
                },
                body: JSON.stringify({
                    rating,
                    review,
                }),
            });

            if (!res.ok) throw new Error("Failed to submit review");

            onReviewSubmitted();
            setRating(0);
            setReview("");
        } catch (err) {
            console.error("Error submitting review:", err);
            alert("Failed to submit review");
        }
    };



    return (
        <div className="user-create-review">
            <div className="game-card-content">
                <span className="subtitle">Review this game</span>
                <br></br>
                <div className="row align-centre">
                    <label className="form-input"><span className="form-label">Rating Value</span>
                    <input name="rating" 
                            type="number" 
                            placeholder="1-10" 
                            required 
                            value={rating}
                            onChange={(e) => setRating(Number(e.target.value))}
                            />
                    </label>

                    <div className="col no-gap no-shrink fit-min">
                        <div className="row align-centre fit-min">
                            <RatingStars rating={8}/>
                        </div>
                    </div>
                </div>
                <br/>

                <label className="form-input">
                    <span className="form-label">Review Body</span>
                    <textarea name="review" 
                            placeholder="Write about this game..."
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            />
                </label>
                
                <br/>
                
                <div className="row">
                <button className="expand" type="button">Cancel</button>
                <button className="expand" type="submit" onClick={() => submitReview()}>Submit Review</button>
                </div>
            </div>
        </div>
    );
}
  

export default ReviewInputForm;