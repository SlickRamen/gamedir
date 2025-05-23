import React from 'react';

interface Props {
    rating: number;
}

function RatingStars({ rating }: Props) {
    const renderStars = (rating: number) => {
        const stars = [];
        
        rating = Math.max(Math.min(rating, 10), 0)

        const fullStars = Math.floor(rating / 2);
        const hasHalfStar = rating % 2 >= 1;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
      
        for (let i = 0; i < fullStars; i++) stars.push(<i className="icon-filled" key={`full-${i}`} />);
        if (hasHalfStar) stars.push(<i className="icon-half-filled" key="half" />);
        for (let i = 0; i < emptyStars; i++) stars.push(<i className="icon-not-filled" key={`empty-${i}`} />);
      
        return stars;
    };

    return (<div className="star-rating">{renderStars(rating)}</div>);
};

export default RatingStars;