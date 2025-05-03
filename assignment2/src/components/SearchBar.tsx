import React from 'react';

interface Props {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  onSearchSubmit: (e: React.FormEvent) => void;
}

function SearchBar({ searchTerm, setSearchTerm, onSearchSubmit } : Props) {
  return (
    <form onSubmit={onSearchSubmit} className="row">
      <input
        type="text"
        placeholder="Search games..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      <button type="submit">Search</button>
    </form>
  );
};

export default SearchBar;
