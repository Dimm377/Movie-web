import { useState, useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Search from "./components/Search.jsx";
import Spinner from "./components/Spinner.jsx";
import MoviesCard from "./components/MoviesCard.jsx";
import TrendingCard from "./components/TrendingCard.jsx";
import heroImage from "./assets/hero.png";
import heroBg from "./assets/hero-bg.png";
import { useDebounce } from "react-use";

gsap.registerPlugin(ScrollTrigger);

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

  const heroRef = useRef(null);

  useDebounce(
    () => {
      setDebounceSearchWeb(searchWeb);
    },
    500,
    [searchWeb]
  );

  // GSAP Hero Animation - runs once on mount
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.fromTo(
        ".hero-image",
        { opacity: 0, scale: 0.8, y: 50 },
        { opacity: 1, scale: 1, y: 0, duration: 1, ease: "power3.out" }
      )
        .fromTo(
          ".hero-title",
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
          "-=0.5"
        )
        .fromTo(
          ".search",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
          "-=0.4"
        );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  // GSAP Trending Animation
  useLayoutEffect(() => {
    if (trendingMovies.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".trending h2",
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power2.out",
        }
      );

      gsap.fromTo(
        ".trending li",
        { opacity: 0, x: 100 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: "power2.out",
        }
      );
    });

    return () => ctx.revert();
  }, [trendingMovies]);

  // GSAP Movies Grid Animation - Optimized for performance
  useLayoutEffect(() => {
    if (movieList.length === 0 || isLoading) return;

    // Use requestAnimationFrame for smoother animation start
    const rafId = requestAnimationFrame(() => {
      const cards = document.querySelectorAll(".movie-card");
      if (cards.length === 0) return;

      // Only animate first 8 cards for performance
      const visibleCards = Array.from(cards).slice(0, 8);
      
      gsap.fromTo(
        visibleCards,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.3,
          stagger: 0.05,
          ease: "power1.out",
        }
      );

      // Set remaining cards to visible immediately
      Array.from(cards).slice(8).forEach(card => {
        gsap.set(card, { opacity: 1, y: 0 });
      });
    });

    return () => cancelAnimationFrame(rafId);
  }, [movieList, isLoading]);

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
        ref={heroRef}
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
            <img src={heroImage} alt="Hero" className="hero-image" />
            <h1 className="hero-title text-white font-bold text-6xl">
              <span className="text-red-400">Next-Gen</span> Movie Interface
            </h1>
            <Search searchWeb={searchWeb} setSearchWeb={setSearchWeb} />
          </header>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-primary">
        <div className="wrapper">
          {/* Trending Section */}
          {trendingMovies.length > 0 && (
            <section className="trending">
              <h2>Trending Movies</h2>
              <ul>
                {trendingMovies.map((movie, index) => (
                  <TrendingCard key={movie.id} movie={movie} index={index} />
                ))}
              </ul>
            </section>
          )}

          {/* All Movies Section */}
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
      </div>
    </main>
  );
};

export default App;
