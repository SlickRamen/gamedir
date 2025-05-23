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
      <button type="submit" style={{display: "flex", flexDirection: "row", alignItems: "center", gap: "5px"}}><i className="icon-search use-line-height" style={{fontSize: "20px"}}></i>Search</button>
    </form>
  );
};

export default SearchBar;
