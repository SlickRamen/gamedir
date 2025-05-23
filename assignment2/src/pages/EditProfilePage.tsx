import React, { useEffect, useRef, useState } from 'react';
import '../resources/css/style.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuthStore } from '../authStore';
import { useNavigate } from 'react-router-dom';
import ProfilePicture from '../components/ProfilePicture';

interface EditFormData {
  firstName: string;
  lastName: string;
  email: string;
  currentPassword: string;
  newPassword: string;
  profileImage: File | null;
}

function EditProfilePage() {
  const [form, setForm] = useState<EditFormData>({
    firstName: '',
    lastName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    profileImage: null,
  });

  const editProfile = useAuthStore((state) => state.editProfile);
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userId = useAuthStore((state) => state.userId);
  
  const [user, setUser] = useState<User | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    let ignore = false;
  
    const fetchUser = async () => {
      if (!userId || !token) {
        setUser(null);
        return;
      }
  
      try {
        const res = await fetch(`http://localhost:4941/api/v1/users/${userId}`, {
          headers: { 'X-Authorization': token },
        });

        const data = await res.json();

        if (!ignore) {
          setUser(data);
        }

      } catch (err) {
      console.error(err);
      setError('Profile edit failed. Please try again.');
      }
    };
  
    fetchUser();
  
    return () => {
      ignore = true;
    };
  }, [userId]);

  useEffect(() => {
    if (!user) return;

    setForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      currentPassword: '',
      newPassword: '',
      profileImage: null,
    });
  }, [user])

  useEffect(() => {
    if (!userId) {
      navigate("/");
    }
  }, [userId, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    // If the input is the file field (profile image), handle it differently
    if (name === 'profileImage') {
      setForm((prev) => ({ ...prev, profileImage: files?.[0] || null }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await editProfile(form);

      navigate('/my-profile');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  const removeProfilePicture = async () => {
    if (!token) return;

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    setForm(prev => ({ ...prev, profileImage: null }));


    await fetch(`http://localhost:4941/api/v1/users/${userId}/image`, {
      method: 'DELETE',
      headers: { 'X-Authorization': token },
    });
  };

  const returnToProfile = () => {
    navigate('/my-profile');
  }

  return (
    <div className="wrapper">
      <Navbar />

      <div className="page-content">
        <div className="row">
          <div className="col w2 clear-on-shrink"/>
          <form onSubmit={handleSubmit} className="col gap-1 w4">
            <span className="title">Update your details</span>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div className="row">
              <ProfilePicture creatorId={userId} file={form.profileImage} refreshKey={Date.now()} size={"profile-edit-page"} />
              <label className="form-input"><span className="form-label">First Name*</span><input name="firstName" value={form.firstName} placeholder="e.g. Jane" required onChange={handleChange} /></label>
              <label className="form-input"><span className="form-label">Last Name*</span><input name="lastName" value={form.lastName}  placeholder="e.g. Doe" required onChange={handleChange} /></label>
            </div>

            <div className="row">
              <label className="form-input"><span className="form-label">Email*</span><input name="email" value={form.email}  placeholder="e.g. jane@example.com" required onChange={handleChange} /></label>
            </div>

            <div className="row">
              <label className="form-input"><span className="form-label">Profile Icon</span><input ref={fileInputRef} name="profileImage" type="file" accept="image/png, image/jpeg, image/gif" onChange={handleChange}/></label>
              <button onClick={() => removeProfilePicture()} type="button" style={{display: "flex", alignItems: "center"}}><i className='icon-trashcan use-line-height' style={{fontSize: "18px"}}></i></button>
            </div>

            <div className="row no-gap relative">
              <label className="form-input"><span className="form-label">Current Password</span>
                <input
                  name="currentPassword"
                  value={form.currentPassword} 
                  placeholder="Password"
                  type={showPassword ? 'text' : 'password'}
                  onChange={handleChange}
                />
              </label>
              <button type="button" className="password-visibility" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            <div className="row no-gap relative">
              <label className="form-input"><span className="form-label">New Password</span>
                <input
                  name="newPassword"
                  value={form.newPassword}
                  placeholder="Password"
                  type={showNewPassword ? 'text' : 'password'}
                  onChange={handleChange}
                />
              </label>
              <button type="button" className="password-visibility" onClick={() => setShowNewPassword(!showNewPassword)}>
                {showNewPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            <br/>

            <div className="row">
              <button className="expand" type="button" onClick={returnToProfile}>Cancel</button>
              <button className="expand" type="submit">Submit</button>
            </div>
          </form>
          <div className="col w2 clear-on-shrink"/>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default EditProfilePage;