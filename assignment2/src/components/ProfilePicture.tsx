import React, { useEffect, useState } from 'react';
import defaultProfile from '../resources/img/default-profile.png';

interface Props {
  creatorId: number;
  size: string;
}

function ProfilePicture({ creatorId, size }: Props) {
    const [imgSrc, setImgSrc] = useState(
        `http://localhost:4941/api/v1/users/${creatorId}/image`
    );
    
    const handleImageError = () => {
        setImgSrc(defaultProfile);
    };

    return (
        <>
            <div className={`profile-badge ${size}`}>
                <img
                    src={imgSrc}
                    alt="Author"
                    onError={handleImageError}
                />
            </div>
        </>
    );
};

export default ProfilePicture;
