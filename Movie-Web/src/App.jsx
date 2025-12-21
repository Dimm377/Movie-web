import { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import "swiper/css";

import "swiper/css/free-mode";
import Search from "./components/Search.jsx";
import Spinner from "./components/Spinner.jsx";
import MoviesCard from "./components/MoviesCard.jsx";
import TrendingCard from "./components/TrendingCard.jsx";
import heroImage from "./assets/hero.png";
import heroBg from "./assets/hero-bg.png";
import { useDebounce } from "react-use";
import { API_BASE_URL, API_OPTIONS } from "./utils/api.js";

const App = () => {
  const [searchWeb, setSearchWeb] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [debounceSearchWeb, setDebounceSearchWeb] = useState("");
  const [showGithub, setShowGithub] = useState(true);

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-out-cubic",
      once: false,
      mirror: true,
      offset: 50,
    });
  }, []);

  // Refresh AOS when movies load
  useEffect(() => {
    if (movieList.length > 0) {
      AOS.refresh();
    }
  }, [movieList]);

  // Hide GitHub icon on scroll
  useEffect(() => {
    const handleScroll = () => {
      setShowGithub(window.scrollY < 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
        throw new Error("Network response failed");
      }
      const data = await response.json();
      if (data.results) {
        console.log("Fetched movies:", data.results);
      } else {
        setErrorMessage("No movies found");
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
            {/* GitHub Icon - Top Right */}
            <a
              href="https://github.com/Dimm377"
              target="_blank"
              rel="noopener noreferrer"
              className={`github-link ${showGithub ? "" : "github-hidden"}`}
              title="Visit my GitHub"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>

            <h1
              className="hero-title text-white font-bold text-6xl"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <span className="text-red-400 underline">Dimm</span> Movie
              Interface
            </h1>
            <p
              className="text-light-200 text-xl mt-3 text-center"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <span className="text-red-400 font-semibold">Up to date</span>{" "}
              movies info only in here
            </p>
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
              <Swiper
                modules={[FreeMode]}
                spaceBetween={20}
                slidesPerView="auto"
                freeMode={true}
                grabCursor={true}
                className="trending-swiper"
              >
                {trendingMovies.map((movie, index) => (
                  <SwiperSlide key={movie.id} style={{ width: "auto" }}>
                    <TrendingCard movie={movie} index={index} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </section>
          )}

          {/* All Movies Section */}
          <section className="all-movies">
            <h2 data-aos="fade-right">All Movies</h2>
            {isLoading ? (
              <Spinner />
            ) : errorMessage ? (
              <p className="text-red-500">{errorMessage}</p>
            ) : movieList.length === 0 ? (
              <p className="text-white">
                No movies found. 404
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
