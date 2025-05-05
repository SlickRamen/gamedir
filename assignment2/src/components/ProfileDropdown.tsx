import { useEffect, useRef, useState } from 'react';
import ProfilePicture from './ProfilePicture';
import { useAuthStore } from '../authStore';
import { useNavigate } from 'react-router-dom';

interface Props {
    userId: number | null;
}

function ProfileDropdown({userId}: Props) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleProfileDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const fetchUser = async () => {
    const res = await fetch(`/api/v1/users/${userId}`);
    const data = await res.json();

    if (data) {
        setUser(data);
    }
  }

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
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  useEffect(() => {
    fetchUser();
  }, [userId]);


  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      {/* <button onClick={handleLogout}>Log out</button> */}
      <div
        className="profile-dropdown-wrapper"
        ref={dropdownRef}
      >
        <a href="#" onClick={toggleProfileDropdown}>
            <ProfilePicture creatorId={userId} size={""} />
        </a>
        {isDropdownOpen && (
          <div className="profile-dropdown">
            Hello { user ? user.firstName : ""}
            <hr className="no-margin"/>
            <a className="dropdown-option" href="#">My Profile</a>
            <a className="dropdown-option" href="#">My Games</a>
            <hr className="no-margin"/>
            <a className="dropdown-option" href="#" onClick={handleLogout}>Log out</a>
          </div>
        )}
      </div>
    </>
  );
}

export default ProfileDropdown;
