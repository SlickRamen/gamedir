import React, { useEffect, useState } from 'react';
import defaultProfile from '../resources/img/default-profile.png';

interface Props {
  creatorId: number | null;
  size: string;
  file?: File | null;
  refreshKey?: string | number;
}

function ProfilePicture({ creatorId, size, file, refreshKey }: Props) {
    const [imgSrc, setImgSrc] = useState<string>(defaultProfile);

    useEffect(() => {
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setImgSrc(objectUrl);

            return () => URL.revokeObjectURL(objectUrl);
        } else if (creatorId !== null) {
            const newSrc = `http://localhost:4941/api/v1/users/${creatorId}/image?${refreshKey ?? Date.now()}`;
            if (imgSrc !== newSrc) {
                setImgSrc(newSrc);
            }
        } else {
            if (imgSrc !== defaultProfile) {
                setImgSrc(defaultProfile);
            }
        }
    }, [creatorId, file, refreshKey]);

    const handleImageError = () => {
        if (imgSrc !== defaultProfile) {
            setImgSrc(defaultProfile);
        }
    };

    return (
        <div className={`profile-badge ${size}`}>
            <img
                src={imgSrc}
                alt="Author"
                onError={handleImageError}
            />
        </div>
    );
}

export default React.memo(ProfilePicture);
