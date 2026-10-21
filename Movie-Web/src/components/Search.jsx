import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { movieService } from "../utils/api.js";
import { useDebounce } from "../hooks/useDebounce.js";

const Search = ({ searchWeb, setSearchWeb }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  const debouncedQuery = useDebounce(searchWeb, 300);

  // Fetch suggestions when debounced query changes
  useEffect(() => {
    let isCancelled = false;

    const fetchSuggestions = async () => {
      const query = debouncedQuery?.trim();
      if (!query || query.length < 2) {
        setSuggestions([]);
        setSelectedIndex(-1);
        return;
      }

      setIsLoading(true);
      try {
        const results = await movieService.search(query, 1);
        if (!isCancelled) {
          setSuggestions(results.slice(0, 6));
          setSelectedIndex(-1);
        }
      } catch (error) {
        if (!isCancelled) {
          console.error("Error fetching suggestions:", error);
          setSuggestions([]);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchSuggestions();
    return () => {
      isCancelled = true;
    };
  }, [debouncedQuery]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSuggestionClick = () => {
    setShowSuggestions(false);
    setSelectedIndex(-1);
    setSearchWeb("");
  };

  const handleKeyDown = (event) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (event.key === "Escape") {
        setShowSuggestions(false);
      }
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (event.key === "Enter" && selectedIndex >= 0 && selectedIndex < suggestions.length) {
      event.preventDefault();
      const selectedMovie = suggestions[selectedIndex];
      setShowSuggestions(false);
      setSelectedIndex(-1);
      setSearchWeb("");
      navigate(`/movie/${selectedMovie.id}`);
    } else if (event.key === "Escape") {
      event.preventDefault();
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  return (
    <div className="search text-white" ref={searchRef}>
      <div>
        <img src="/search.svg" alt="" aria-hidden="true" />
        <input
          type="search"
          role="combobox"
          aria-expanded={showSuggestions && suggestions.length > 0}
          aria-autocomplete="list"
          aria-controls="search-suggestions-list"
          aria-activedescendant={
            selectedIndex >= 0 && suggestions[selectedIndex]
              ? `suggestion-${suggestions[selectedIndex].id}`
              : undefined
          }
          aria-label="Search movies"
          placeholder="Search your favorite movies"
          value={searchWeb}
          onChange={(event) => {
            setSearchWeb(event.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
        />
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && searchWeb.trim().length >= 2 && (
        <div
          id="search-suggestions-list"
          className="search-suggestions"
          role="listbox"
          aria-label="Movie search suggestions"
        >
          {isLoading ? (
            <div className="suggestion-loading">Searching...</div>
          ) : suggestions.length > 0 ? (
            suggestions.map((movie, index) => (
              <Link
                key={movie.id}
                id={`suggestion-${movie.id}`}
                to={`/movie/${movie.id}`}
                className={`suggestion-item ${index === selectedIndex ? "active-suggestion" : ""}`}
                role="option"
                aria-selected={index === selectedIndex}
                onClick={handleSuggestionClick}
              >
                <img
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
                      : "/no-movie.png"
                  }
                  alt={movie.title}
                  onError={(e) => {
                    e.currentTarget.src = "/no-movie.png";
                  }}
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
