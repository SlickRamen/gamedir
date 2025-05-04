import React, { useEffect, useState } from 'react';
import '../resources/css/style.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuthStore } from '../authStore';
import { redirect, useNavigate } from 'react-router-dom';

interface SigninFormData {
  email: string;
  password: string;
}

function SigninPage() {
  const [form, setForm] = useState<SigninFormData>({
    email: '',
    password: '',
  });

  const signin = useAuthStore((state) => state.signin);
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Registering user
      const response = await signin(form);
      // Redirect to home or another page after successful registration
      navigate('/');
    } catch (err) {
      console.error(err);
      setError('Signin failed. Please try again.');
    }
  };

  const returnToHome = () => {
    navigate('/');
  }
  
  // Redirect if already signed in
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
            <span className="title">Sign in to your account</span>
            {error && <p style={{ color: 'red' }}>{error}</p>}
  
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

            <br/>

            <div className="row">
              <button className="expand" type="button" onClick={returnToHome}>Cancel</button>
              <button className="expand" type="submit">Sign In</button>
            </div>
          </form>
          <div className="col w2"/>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default SigninPage;