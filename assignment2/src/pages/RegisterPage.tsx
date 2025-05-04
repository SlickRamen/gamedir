import React, { useEffect, useState } from 'react';
import '../resources/css/style.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuthStore } from '../authStore';
import { useNavigate } from 'react-router-dom';

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  profileImage: File | null;
}

function RegisterPage() {
  const [form, setForm] = useState<RegisterFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    profileImage: null,
  });


  const register = useAuthStore((state) => state.register);
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      // Registering user
      const response = await register(form);
      // Redirect to home or another page after successful registration
      navigate('/');
    } catch (err) {
      console.error(err);
      setError('Registration failed. Please try again.');
    }
  };

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token]);

  return (
    <div className="wrapper">
      <Navbar />

      <div className="page-content">
        <div className="row">
          <div className="col w2"/>
          <form onSubmit={handleSubmit} className="col gap-1 w4">
            <span className="title">Register as a member</span>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            
            <div className="row">
              <label className="form-input"><span className="form-label">First Name*</span><input name="firstName" placeholder="e.g. Jane" required onChange={handleChange} /></label>
              <label className="form-input"><span className="form-label">Last Name*</span><input name="lastName" placeholder="e.g. Doe" required onChange={handleChange} /></label>
            </div>

            <div className="row">
              <label className="form-input"><span className="form-label">Email*</span><input name="email" placeholder="e.g. jane@example.com" required onChange={handleChange} /></label>
            </div>

            <div className="row no-gap relative">
              <label className="form-input"><span className="form-label">Password*</span>
                <input
                  name="password"
                  placeholder="Password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  onChange={handleChange}
                />
              </label>
              <button type="button" className="password-visibility" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            <div className="row">
              <label className="form-input"><span className="form-label">Profile Icon</span><input name="profileImage" type="file" accept="image/png, image/jpeg, image/gif" onChange={handleChange}/></label>
            </div>

            <br/>

            <div className="row">
              <button className="expand" type="button">Cancel</button>
              <button className="expand" type="submit">Register</button>
            </div>
          </form>
          <div className="col w2"/>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default RegisterPage;