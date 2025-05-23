
import logo from '../resources/img/logo-with-text.svg';
import profilePic from '../resources/img/default-profile.png';
import { useState } from 'react';

interface Props {
  genreIds: Genre[];
  platformIds: Platform[];
  onFilterChange: (filters: FilterOptions) => void;
}

function FilterBar({ genreIds, platformIds, onFilterChange }: Props) {
  const [expanded, setExpanded] = useState({
    price: false,
    genre: false,
    platform: false,
    sort: false,
  });

  const [price, setPrice] = useState(0);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<number[]>([]);
  const [selectedSort, setSelectedSort] = useState<string>("CREATED_ASC");

  const toggle = (key: keyof typeof expanded) => {
    setExpanded(prev => {
      const isAlreadyOpen = prev[key];
      return {
        price: false,
        genre: false,
        platform: false,
        sort: false,
        [key]: !isAlreadyOpen, // toggle only the clicked one
      };
    });
  };

  const handleGenreToggle = (id: number) => {
    const updated = selectedGenres.includes(id)
      ? selectedGenres.filter(g => g !== id)
      : [...selectedGenres, id];
  
    setSelectedGenres(updated);
    onFilterChange({
      genreIds: updated, price,
      platformIds: selectedPlatforms,
      sort: selectedSort
    });
  };

  const handlePlatformToggle = (id: number) => {
    const updated = selectedPlatforms.includes(id)
      ? selectedPlatforms.filter(g => g !== id)
      : [...selectedPlatforms, id];
  
    setSelectedPlatforms(updated);
    onFilterChange({
      genreIds: selectedGenres, price,
      platformIds: updated,
      sort: selectedSort
    });
  };

  const handle = (id: number) => {
    const updated = selectedPlatforms.includes(id)
      ? selectedPlatforms.filter(g => g !== id)
      : [...selectedPlatforms, id];
  
    setSelectedPlatforms(updated);
    onFilterChange({
      genreIds: selectedGenres, price,
      platformIds: updated,
      sort: selectedSort
    });
  };
  

  return (
    <>
        <div className="filter-options">
          <div className="filter">
            <a onClick={() => toggle('price')} className="filter-header" href="#" tabIndex={0}>
              Price <i className={expanded.price ? 'icon-hamburger-close' : 'icon-hamburger'}></i>
            </a>
            {expanded.price && (
              <div className="filter-body">
                <input
                  type="number"
                  className="filter-input"
                  value={price}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    setPrice(value);
                    onFilterChange({
                      genreIds: selectedGenres, price: value,
                      platformIds: selectedPlatforms,
                      sort: selectedSort
                    });
                  }}
                  
                />

              </div>
            )}
          </div>

          <div className="filter">
            <a onClick={() => toggle('genre')} className="filter-header" href="#" tabIndex={0}>
              Genre <i className={expanded.genre ? 'icon-hamburger-close' : 'icon-hamburger'}></i>
            </a>
            {expanded.genre && (
              <div className="filter-body">
                {genreIds.map((genre) => (
                  <label key={genre.genreId} className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedGenres.includes(genre.genreId)}
                      onChange={() => handleGenreToggle(genre.genreId)}
                    />
                    {genre.name}
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="filter">
            <a onClick={() => toggle('platform')} className="filter-header" href="#" tabIndex={0}>
              Platform <i className={expanded.platform ? 'icon-hamburger-close' : 'icon-hamburger'}></i>
            </a>
            {expanded.platform && (
              <div className="filter-body">
                {platformIds.map((platform) => (
                  <label key={platform.platformId} className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedPlatforms.includes(platform.platformId)}
                      onChange={() => handlePlatformToggle(platform.platformId)}
                    />
                    {platform.name}
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="filter">
            <a onClick={() => toggle('sort')} className="filter-header" href="#" tabIndex={0}>
              Sort By <i className={expanded.sort ? 'icon-hamburger-close' : 'icon-hamburger'}></i>
            </a>
            {expanded.sort && (
                <select
                  id="sort-select"
                  className="filter-body"
                  value={selectedSort}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSelectedSort(value);
                    onFilterChange({
                      genreIds: selectedGenres, price, sort: value,
                      platformIds: selectedPlatforms
                    });
                  }}
                >
                  <option value="CREATED_ASC">Default (Oldest First)</option>
                  <option value="CREATED_DESC">Newest First</option>
                  <option value="PRICE_ASC">Price: Low to High</option>
                  <option value="PRICE_DESC">Price: High to Low</option>
                  <option value="ALPHABETICAL_ASC">Title: A-Z</option>
                  <option value="ALPHABETICAL_DESC">Title: Z-A</option>
                  <option value="RATING_DESC">Rating: High to Low</option>
                  <option value="RATING_ASC">Rating: Low to High</option>
                </select>)}
          </div>
        </div>
    </>
  );
}

export default FilterBar;