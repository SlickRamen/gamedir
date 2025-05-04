import React, { useEffect, useState } from 'react';
import '../resources/css/style.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuthStore } from '../authStore';
import { useNavigate } from 'react-router-dom';

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
  
  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token]);

  return (
    <div className="wrapper">
      <Navbar />

      <div className="page-content">
        <span className="title">Sign in to your account</span>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input name="email" placeholder="Email" required onChange={handleChange} />

          <div>
            <input
              name="password"
              placeholder="Password"
              type={showPassword ? 'text' : 'password'}
              required
              onChange={handleChange}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <button type="submit">Sign In</button>
        </form>
      </div>

      <Footer />
    </div>
  );
}

export default SigninPage;