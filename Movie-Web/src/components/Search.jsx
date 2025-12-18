import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL, API_OPTIONS } from "../utils/api.js";

const Search = ({ searchWeb, setSearchWeb }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef(null);

  // Fetch suggestions when user types
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchWeb.length < 2) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          `${API_BASE_URL}/search/movie?query=${encodeURIComponent(searchWeb)}&page=1`,
          API_OPTIONS
        );
        const data = await response.json();
        setSuggestions(data.results?.slice(0, 6) || []);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [searchWeb]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSuggestionClick = () => {
    setShowSuggestions(false);
    setSearchWeb("");
  };

  return (
    <div className="search text-white" ref={searchRef}>
      <div>
        <img src="search.svg" alt="" />
        <input
          type="text"
          placeholder="Search your favorite movies"
          value={searchWeb}
          onChange={(event) => setSearchWeb(event.target.value)}
          onFocus={() => setShowSuggestions(true)}
        />
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && searchWeb.length >= 2 && (
        <div className="search-suggestions">
          {isLoading ? (
            <div className="suggestion-loading">Searching...</div>
          ) : suggestions.length > 0 ? (
            suggestions.map((movie) => (
              <Link
                key={movie.id}
                to={`/movie/${movie.id}`}
                className="suggestion-item"
                onClick={handleSuggestionClick}
              >
                <img
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
                      : "/no-movie.png"
                  }
                  alt={movie.title}
                />
                <div className="suggestion-info">
                  <p className="suggestion-title">{movie.title}</p>
                  <span className="suggestion-year">
                    {movie.release_date?.split("-")[0] || "N/A"}
                  </span>
                </div>
              </Link>
            ))
          ) : (
            <div className="suggestion-empty">No movies found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
