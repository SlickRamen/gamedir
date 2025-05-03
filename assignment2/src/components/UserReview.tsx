import React from "react";
import { Link } from "react-router-dom";
import ProfilePicture from "./ProfilePicture";


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

    const renderStars = (rating: number) => {
        const stars = [];
        const fullStars = Math.floor(rating / 2);
        const hasHalfStar = rating % 2 >= 1;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
      
        for (let i = 0; i < fullStars; i++) stars.push(<i className="icon-add" key={`full-${i}`} />);
        if (hasHalfStar) stars.push(<i className="icon-calendar" key="half" />);
        for (let i = 0; i < emptyStars; i++) stars.push(<i className="icon-trashcan" key={`empty-${i}`} />);
      
        return stars;
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
                        <div className="star-rating">
                            {renderStars(review.rating)}
                        </div>
                        <span>{review.rating} / 10</span>
                    </div>
                    <span className="">{review.review != "" ? review.review : 'No review content.'}</span>
                </div>
                
            </div>
        </div>
    );
}
  

export default UserReview;