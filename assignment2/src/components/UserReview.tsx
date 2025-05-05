import React from "react";
import { Link } from "react-router-dom";
import ProfilePicture from "./ProfilePicture";
import RatingStars from "./RatingStars";


interface Props {
    review: Review;
}

function UserReview({ review }: Props){
    const fetchedDate = new Date(review.timestamp);
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    };

    const date: string = fetchedDate.toLocaleDateString(undefined, options);
    return (
        <div className="user-review">
            <div className="game-card-content">
                <div className="row align-centre">
                    <ProfilePicture creatorId={review.reviewerId} size={"author-icon"}/>
                    <span className="game-author">{review.reviewerFirstName} {review.reviewerLastName}</span>
                    <span className="float-right">{date}</span>
                </div>

                <div className="col no-gap">
                    <div className="row align-centre">
                        <RatingStars rating={review.rating}/>
                        <span>{review.rating} / 10</span>
                    </div>
                    <span className="">{review.review != "" ? review.review : 'No review content.'}</span>
                </div>
                
            </div>
        </div>
    );
}
  

export default UserReview;