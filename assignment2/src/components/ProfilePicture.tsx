import React, { useEffect, useState } from 'react';
import defaultProfile from '../resources/img/default-profile.png';

interface Props {
  creatorId: number | null;
  size: string;
  refreshKey?: string | number;
}

function ProfilePicture({ creatorId, size, refreshKey }: Props) {
    const [imgSrc, setImgSrc] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (creatorId !== null) {
            setImgSrc(`/api/v1/users/${creatorId}/image?${refreshKey ?? Date.now()}`);
        }
    }, [creatorId, refreshKey]);

    const handleImageError = () => {
        setImgSrc(defaultProfile);
    };

    return (
        <div className={`profile-badge ${size}`}>
            { imgSrc == "" ? (
            <>
            </>
            ) : (<img
                src={imgSrc}
                alt="Author"
                onError={handleImageError}
            />)}
        </div>
    );
}

export default React.memo(ProfilePicture);
