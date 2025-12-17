import { useState, useEffect } from "react";
import Search from "./components/Search.jsx";

const API_BASE_URL = "https://api.themoviedb.org/3";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  const [searchWeb, setSearchWeb] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [movielist, setMovielist] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const fetchMovies = async () => {
    setisLoading(true);
    setErrorMessage("");
    try {
      const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      if (data.results) {
        console.log("Fetched movies:", data.results);
      } else {
        setErrorMessage("No movies found.");
        setMovielist([]);
        return;
      }

      setMovielist(data.results || []);
    } catch (error) {
      console.error("Error fetching movies:", error);
      setErrorMessage("Failed to fetch movies. Please try again later.");
    } finally {
      setisLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <main>
      <div className="picture" />
      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero" />
          <h1 className="text-white font-bold text-6xl">
            <span className="text-gradient">Next-Gen</span> Movie Interface.
          </h1>
          <Search searchWeb={searchWeb} setSearchWeb={setSearchWeb} />
        </header>
        <section className="all-movies">
          <h2>All Movies</h2>
          {isLoading ? (
            <p className="text-white">Loading movies...</p>
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <div>
              {movielist.map((movie) => (
                <div key={movie.id}>
                  <p className="text-white">{movie.title}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default App;
