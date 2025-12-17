import { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Search from "./components/Search.jsx";
import Spinner from "./components/Spinner.jsx";
import MoviesCard from "./components/MoviesCard.jsx";
import TrendingCard from "./components/TrendingCard.jsx";
import heroImage from "./assets/hero.png";
import heroBg from "./assets/hero-bg.png";
import { useDebounce } from "react-use";

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
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [debounceSearchWeb, setDebounceSearchWeb] = useState("");

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-out-cubic",
      once: true,
      offset: 50,
    });
  }, []);

  // Refresh AOS when movies load
  useEffect(() => {
    if (movieList.length > 0) {
      AOS.refresh();
    }
  }, [movieList]);

  // No JS animation needed - using CSS marquee animation

  useDebounce(
    () => {
      setDebounceSearchWeb(searchWeb);
    },
    500,
    [searchWeb]
  );

  const fetchMovies = async (query = "") => {
    setisLoading(true);
    setErrorMessage("");
    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
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

  const fetchTrendingMovies = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/trending/movie/week`,
        API_OPTIONS
      );
      if (!response.ok) throw new Error("Failed to fetch trending movies");
      const data = await response.json();
      setTrendingMovies(data.results?.slice(0, 5) || []);
    } catch (error) {
      console.error("Error fetching trending movies:", error);
    }
  };

  useEffect(() => {
    fetchTrendingMovies();
  }, []);

  useEffect(() => {
    fetchMovies(debounceSearchWeb);
  }, [debounceSearchWeb]);

  return (
    <main className="min-h-screen bg-primary">
      {/* Hero Section with background */}
      <div
        className="min-h-[60vh] w-full"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="picture" />
        <div className="wrapper">
          <header>
            <img
              src={heroImage}
              alt="Hero"
              className="hero-image"
              data-aos="zoom-in"
              data-aos-duration="1000"
            />
            <h1
              className="hero-title text-white font-bold text-6xl"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <span className="text-red-400">Next-Gen</span> Movie Interface
            </h1>
            <div data-aos="fade-up" data-aos-delay="400">
              <Search searchWeb={searchWeb} setSearchWeb={setSearchWeb} />
            </div>
          </header>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-primary">
        <div className="wrapper">
          {/* Trending Section */}
          {trendingMovies.length > 0 && (
            <section className="trending">
              <h2 data-aos="fade-right">Trending Movies</h2>
              <ul>
                {/* Original items */}
                {trendingMovies.map((movie, index) => (
                  <TrendingCard key={movie.id} movie={movie} index={index} />
                ))}
                {/* Duplicated items for seamless loop */}
                {trendingMovies.map((movie, index) => (
                  <TrendingCard key={`dup-${movie.id}`} movie={movie} index={index} />
                ))}
              </ul>
            </section>
          )}

          {/* All Movies Section */}
          <section className="all-movies">
            <h2 className="mt-15" data-aos="fade-right">
              All Movies
            </h2>
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
                {movieList.map((movie, index) => (
                  <MoviesCard key={movie.id} movie={movie} index={index} />
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default App;
