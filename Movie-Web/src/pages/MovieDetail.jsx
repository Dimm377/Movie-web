import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import gsap from "gsap";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchMovieDetail = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${API_BASE_URL}/movie/${id}?append_to_response=credits,videos`,
          API_OPTIONS
        );
        if (!response.ok) throw new Error("Failed to fetch movie details");
        const data = await response.json();
        setMovie(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieDetail();
  }, [id]);

  // GSAP Cinematic Entrance Animation
  useLayoutEffect(() => {
    if (!movie || isLoading) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Backdrop fade in
      tl.fromTo(
        ".movie-backdrop",
        { opacity: 0, scale: 1.1 },
        { opacity: 1, scale: 1, duration: 1.2 }
      )
        // Back button slide in
        .fromTo(
          ".back-button",
          { opacity: 0, x: -30 },
          { opacity: 1, x: 0, duration: 0.5 },
          "-=0.8"
        )
        // Poster cinematic reveal
        .fromTo(
          ".movie-poster",
          { opacity: 0, x: -80 },
          { opacity: 1, x: 0, duration: 0.8 },
          "-=0.4"
        )
        // Title reveal
        .fromTo(
          ".movie-title",
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.5"
        )
        // Tagline
        .fromTo(
          ".movie-tagline",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5 },
          "-=0.4"
        )
        // Meta info stagger
        .fromTo(
          ".movie-meta > *",
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, stagger: 0.1, duration: 0.4 },
          "-=0.3"
        )
        // Genre badges stagger
        .fromTo(
          ".genre-badge",
          { opacity: 0, scale: 0.8, y: 20 },
          { opacity: 1, scale: 1, y: 0, stagger: 0.08, duration: 0.4 },
          "-=0.2"
        )
        // Overview section
        .fromTo(
          ".movie-overview",
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.2"
        )
        // Cast items stagger
        .fromTo(
          ".cast-item",
          { opacity: 0, x: 30 },
          { opacity: 1, x: 0, stagger: 0.1, duration: 0.4 },
          "-=0.3"
        )
        // Trailer button bounce in
        .fromTo(
          ".trailer-button",
          { opacity: 0, scale: 0.5 },
          { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" },
          "-=0.2"
        );
    }, containerRef);

    return () => ctx.revert();
  }, [movie, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="spinner" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!movie) return null;

  const {
    title,
    backdrop_path,
    poster_path,
    vote_average,
    release_date,
    runtime,
    genres,
    overview,
    tagline,
    credits,
    videos,
  } = movie;

  const trailer = videos?.results?.find(
    (v) => v.type === "Trailer" && v.site === "YouTube"
  );

  const topCast = credits?.cast?.slice(0, 6) || [];

  return (
    <main className="min-h-screen bg-primary" ref={containerRef}>
      {/* Backdrop */}
      <div
        className="movie-backdrop"
        style={{
          backgroundImage: backdrop_path
            ? `url(https://image.tmdb.org/t/p/original${backdrop_path})`
            : "none",
        }}
      >
        <div className="backdrop-overlay" />
      </div>

      <div className="movie-detail-wrapper">
        {/* Back Button */}
        <button onClick={() => navigate(-1)} className="back-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <div className="movie-detail-content">
          {/* Poster */}
          <div className="movie-poster">
            <img
              src={
                poster_path
                  ? `https://image.tmdb.org/t/p/w500${poster_path}`
                  : "/no-movie.png"
              }
              alt={title}
            />
          </div>

          {/* Info */}
          <div className="movie-info">
            <h1 className="movie-title">{title}</h1>
            {tagline && <p className="movie-tagline">"{tagline}"</p>}

            <div className="movie-meta">
              <div className="rating-badge">
                <img src="/star.svg" alt="rating" />
                <span>{vote_average?.toFixed(1)}</span>
              </div>
              <span className="meta-divider">•</span>
              <span>{release_date?.split("-")[0]}</span>
              <span className="meta-divider">•</span>
              <span>{runtime} min</span>
            </div>

            {/* Genres */}
            <div className="movie-genres">
              {genres?.map((genre) => (
                <span key={genre.id} className="genre-badge">
                  {genre.name}
                </span>
              ))}
            </div>

            {/* Overview */}
            <div className="movie-overview">
              <h3>Overview</h3>
              <p>{overview}</p>
            </div>

            {/* Cast */}
            {topCast.length > 0 && (
              <div className="movie-cast">
                <h3>Top Cast</h3>
                <div className="cast-list">
                  {topCast.map((actor) => (
                    <div key={actor.id} className="cast-item">
                      <img
                        src={
                          actor.profile_path
                            ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                            : "/no-avatar.png"
                        }
                        alt={actor.name}
                      />
                      <div className="cast-info">
                        <p className="actor-name">{actor.name}</p>
                        <p className="character-name">{actor.character}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trailer */}
            {trailer && (
              <div className="movie-trailer">
                <a
                  href={`https://www.youtube.com/watch?v=${trailer.key}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="trailer-button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Watch Trailer
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default MovieDetail;
