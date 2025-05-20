import React, { useEffect, useState, useMemo } from 'react';
import '../resources/css/style.css';
import Navbar from '../components/Navbar';
import GameCard from '../components/GameCard';
import Footer from '../components/Footer';
import { useAuthStore } from '../authStore';
import { useNavigate } from 'react-router-dom';
import ProfilePicture from '../components/ProfilePicture';

function MyProfilePage() {
  const userId = useAuthStore((state) => state.userId);
  const token = useAuthStore((state) => state.token);

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let ignore = false;
  
    const fetchUser = async () => {
      if (!userId || !token) {
        setUser(null);
        return;
      }
  
      try {
        const res = await fetch(`/api/v1/users/${userId}`, {
          headers: { 'X-Authorization': token },
        });
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


  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      navigate("/");
    }
  }, [userId, navigate]);

  return (
      <div className="wrapper">
        <Navbar />

        <div className="page-content">
          <div className="row">
            <div className="col w2"/>
            <div className="col w4 align-centre">
              <ProfilePicture creatorId={userId} size={"massive"} />
              <span>{user?.firstName + ' ' + user?.lastName}</span>
              <span>{user?.email}</span>
            </div>
            <div className="col w2"/>
          </div>
        </div>

        <Footer />
      </div>
    )
}

export default MyProfilePage