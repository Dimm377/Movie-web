import { useState, useEffect } from "react";
import Search from "./components/Search.jsx";
import Spinner from "./components/Spinner.jsx";
import MoviesCard from "./components/moviesCard.jsx";

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
  const [movieList, setMovieList] = useState([]);
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
        setMovieList([]);
        return;
      }

      setMovieList(data.results || []);
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
          <img src="./assets/hero.png" alt="Hero" />
          <h1 className="text-white font-bold text-6xl">
            <span className="text-red-400">Next-Gen</span> Movie Interface.
          </h1>
          <Search searchWeb={searchWeb} setSearchWeb={setSearchWeb} />
        </header>
        <section className="all-movies">
          <h2 className="mt-15">All Movies</h2>
          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : movieList.length === 0 ? (
            <p className="text-white">
              No movies found. Check console for errors.
            </p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MoviesCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

export default App;
