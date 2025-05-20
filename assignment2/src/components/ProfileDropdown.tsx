import { useEffect, useRef, useState } from 'react';
import ProfilePicture from './ProfilePicture';
import { useAuthStore } from '../authStore';
import { useNavigate } from 'react-router-dom';

function ProfileDropdown() {
  const userId = useAuthStore((state) => state.userId);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleProfileDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) 
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isDropdownOpen]);

  useEffect(() => {
    let ignore = false;
  
    const fetchUser = async () => {
      if (!userId) {
        setUser(null);
        return;
      }
  
      try {
        const res = await fetch(`/api/v1/users/${userId}`);
        const data = await res.json();
        if (!ignore) {
          setUser(data);
        }
      } catch (err) {
        console.error('Failed to fetch user:', err);
      }
    };
  
    fetchUser();
  
    return () => {
      ignore = true;
    };
  }, [userId]);

  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <div
        className="profile-dropdown-wrapper"
        ref={dropdownRef}
      >
        <div className="profile-picture-wrapper" onClick={toggleProfileDropdown}>
            <ProfilePicture creatorId={userId} size={""} />
        </div>
        {isDropdownOpen && (
          <div className="profile-dropdown">
            Hello { user ? user.firstName : ""}
            <hr className="no-margin"/>
            <button className="dropdown-option" onClick={() => navigate("/my-profile")}>My Profile</button>
            <button className="dropdown-option">Edit Profile</button>
            <hr className="no-margin"/>
            <button className="dropdown-option" onClick={handleLogout}>Log out</button>
          </div>
        )}
      </div>
    </>
  );
}

export default ProfileDropdown;
