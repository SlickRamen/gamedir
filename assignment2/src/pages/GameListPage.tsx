import React, { useEffect, useState, useMemo } from 'react';
import '../resources/css/style.css';
import Navbar from '../components/Navbar';
import GameCard from '../components/GameCard';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import Footer from '../components/Footer';

function GameListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [submittedSearchTerm, setSubmittedSearchTerm] = useState("");

  const [filters, setFilters] = useState<FilterOptions>({
    genreIds: [],
    platformIds: [],
    price: 0,
    sort: "CREATED_ASC"
  });

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const resultsPerPage = 10;

  const [games, setGames] = useState<Game[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);
  const [resultsCount, setResultsCount] = useState(0);

  const fetchGames = async (searchQuery: string="") => {
    setLoading(true); // Start loading

    try {
      // Construct query
      const params = new URLSearchParams();
      if (searchQuery) params.set("q", searchQuery);
      if (filters.price) params.set("price", `${filters.price}`);
      if (filters.genreIds && filters.genreIds.length > 0) {
        filters.genreIds.forEach(id => params.append("genreIds", id.toString()));
      }
      if (filters.platformIds && filters.platformIds.length > 0) {
        filters.platformIds.forEach(id => params.append("platformIds", id.toString()));
      }

      if (filters.sort) {
        params.set("sortBy", filters.sort);
      }

      params.set("count", `${resultsPerPage}`);
      params.set("startIndex", `${page * resultsPerPage}`);

      const response = await fetch(`/api/v1/games?${params.toString()}`);
      const data = await response.json();

      // React elements
      setGames(data.games);
      setResultsCount(data.count);
      setTotalPages(Math.floor(data.count / resultsPerPage));
    } catch (error) {

      console.error('Error fetching games:', error);
    } finally {
      setLoading(false); // End loading
    }
  };


  const fetchGenres = async () => {
    try {
      const response = await fetch(`/api/v1/games/genres`);
      const data = await response.json();

      // React elements
      setGenres(data);
      console.log(data);
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };



  const fetchPlatforms = async () => {
    try {
      const response = await fetch(`/api/v1/games/platforms`);
      const data = await response.json();

      // React elements
      setPlatforms(data);
      console.log(data);
    } catch (error) {
      console.error('Error fetching platforms:', error);
    }
  };

  // Default
  useEffect(() => {
    fetchGenres();
    fetchGames();
    fetchPlatforms();
  }, []);


  const genreMap = useMemo(() => {
    const map: Record<number, string> = {};
    genres.forEach((g) => {
      map[g.genreId] = (g.genreId, g.name);
    });
    return map;
  }, [genres]);

  const platformMap = useMemo(() => {
    const map: Record<number, string> = {};
    platforms.forEach((p) => {
      map[p.platformId] = p.name;
    });
    return map;
  }, [platforms]);


  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedSearchTerm(searchTerm);
  };

  const handleFilterChange = (updatedFilters: FilterOptions) => {
    setFilters(updatedFilters);
  }

  // Re-run whenever the filters, search or page change.
  useEffect(() => {
    fetchGames();
  }, [filters, searchTerm, page]);

  return (
      <div className="wrapper">
        <Navbar />

        <div className="page-content">
          <span className="title">Explore games</span>
          
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onSearchSubmit={handleSearchSubmit}
          />
          
          <FilterBar
            genreIds={genres}
            platformIds={platforms}
            onFilterChange={handleFilterChange}
          />

          <hr/>
          <div className="row">
            <span className="subtitle">{resultsCount} result(s) {submittedSearchTerm != '' ? `for '${submittedSearchTerm}'` : ''}</span>
            <span className="subtitle float-right">Showing {page * resultsPerPage + 1}-{Math.min((page+1) * resultsPerPage, resultsCount)}</span>
          </div>
          {loading ? (
            <p>Loading...</p>
          ) : games.length === 0 ? (
            <span className="error-banner">No results found.</span>
          ) : (
            <>
              <div className="game-container-grid">
                {games.map((game) => {
                  const genre = genres.find((g) => g.genreId === game.genreId);
                  const gamePlatforms = platforms.filter((p) => game.platformIds.includes(p.platformId));

                  return (
                    <GameCard
                      key={game.gameId}
                      game={game}
                      genre={genre}
                      platforms={gamePlatforms}
                    />
                  );
                })}
              </div>
              { page+1 > totalPages ? (
                <span className="error-banner">
                No more results.
              </span>) : (<></>)}
            </>
          )}
          <div className="pagination">
            <button disabled={page === 0} onClick={() => setPage(0)}>
              First
            </button>
            <button disabled={page === 0} onClick={() => setPage(page - 1)}>
              Prev
            </button>
            <span>Page {page + 1}</span>
            <button
              disabled={page + 1 > totalPages} onClick={() => setPage(page + 1)}>
              Next
            </button>
            <button
              disabled={page + 1 > totalPages} onClick={() => setPage(totalPages)}>
              Last
            </button>
          </div>
        </div>

        <Footer />
      </div>
    )
}

export default GameListPage