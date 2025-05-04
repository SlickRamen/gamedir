import React, { useEffect, useState } from 'react';
import '../resources/css/style.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuthStore } from '../authStore';
import { useNavigate } from 'react-router-dom';

interface CreateGameFormData {
  title: string,
  description: string,
  genreId: number,
  platformIds: number[],
  image: File | null,
  price: number,
}

function CreateGamePage() {
  const [form, setForm] = useState<CreateGameFormData>({
    title: '',
    description: '',
    genreId: 0,
    platformIds: [],
    image: null,
    price: 0,
  });

  const [availableGenres, setAvailableGenres] = useState<{ genreId: number, name: string }[]>([]);
  const [availablePlatforms, setAvailablePlatforms] = useState<{ platformId: number, name: string }[]>([]);


  const createGame = useAuthStore((state) => state.createGame);
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);

  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files, type } = e.target;

    if (name === 'image') {
      setForm((prev) => ({ ...prev, image: files?.[0] || null }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: type === 'number' ? Number(value) : value,
      }));
    }
  };


  const handleChangeCB = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    const platformId = Number(value); // Convert to number to avoid NaN
  
    setForm((prev) => {
      const updatedPlatforms = checked
        ? [...prev.platformIds, platformId] // Add the platform ID if checked
        : prev.platformIds.filter((id) => id !== platformId); // Remove the platform ID if unchecked
  
      return {
        ...prev,
        platformIds: updatedPlatforms, // Update the platformIds array
      };
    });
  };  

  const handleChangeDD = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value);

    console.log(e.target.value);
    console.log(value);
    setForm((prev) => ({ ...prev, genreId: value }));
  };
  

  const handleChangeTA = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await createGame(form);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError('Creation failed. Please try again.');
    }
  };

  const returnToHome = () => {
    navigate('/');
  }

  // Redirect if not signed in
  useEffect(() => {
    if (!token) {
      navigate('/');
    }
  }, [token]);

  // Fetch genres and platformIds
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [genresRes, platformsRes] = await Promise.all([
          fetch('/api/v1/games/genres'),
          fetch('/api/v1/games/platforms'),
        ]);
  
        const genresData = await genresRes.json();
        const platformsData = await platformsRes.json();
  
        setAvailableGenres(genresData);
        setAvailablePlatforms(platformsData);
      } catch (err) {
        console.error('Failed to fetch genres/platforms:', err);
      }
    };
  
    fetchData();
  }, []);  

  return (
    <div className="wrapper">
      <Navbar />

      <div className="page-content">
        <div className="row">
          <div className="col w2"/>
          <form onSubmit={handleSubmit} className="col gap-1 w4">
            <span className="title">Create a new game</span>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            
            <div className="row">
              <label className="form-input"><span className="form-label">Title*</span><input name="title" placeholder="e.g. Marathon" required onChange={handleChange} /></label>
            </div>

            <div className="row">
            <label className="form-input"><span className="form-label">Description*</span><textarea name="description" placeholder="e.g. An awesome game" required onChange={handleChangeTA} /></label>
            </div>

            <div className="row">
              <label className="form-input"><span className="form-label">Price*</span><input name="price" type="number" placeholder="e.g. 1000" required onChange={handleChange} /></label>
            </div>

            <div className="row">
              <label className="form-input">
                <span className="form-label">Genre*</span>
                <select name="genreId" required value={form.genreId} onChange={handleChangeDD}>
                  <option value="">Select a genre</option>
                  {availableGenres.map((g) => (
                    <option key={g.genreId} value={g.genreId}>{g.name}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="row">
              <div className="form-input border">
                <span className="form-label">Platforms*</span>
                <div className="row wrap">
                  {availablePlatforms.map((p) => (
                    <label key={p.platformId} className="checkbox-label">
                      <input
                        type="checkbox"
                        name="platformIds"
                        value={p.platformId}
                        checked={form.platformIds.includes(p.platformId)}
                        onChange={handleChangeCB}
                      />
                      {p.name}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="row">
              <label className="form-input"><span className="form-label">Game Cover Image*</span><input name="image" type="file" accept="image/png, image/jpeg, image/gif" onChange={handleChange}/></label>
            </div>

            <br/>

            <div className="row">
              <button className="expand" type="button" onClick={returnToHome}>Cancel</button>
              <button className="expand" type="submit">Create Game</button>
            </div>
          </form>
          <div className="col w2"/>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default CreateGamePage;

