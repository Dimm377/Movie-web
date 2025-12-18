import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AOS from "aos";
import Spinner from "../components/Spinner.jsx";
import { API_BASE_URL, API_OPTIONS } from "../utils/api.js";

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

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

  // Refresh AOS when movie loads
  useEffect(() => {
    if (movie) {
      AOS.refresh();
    }
  }, [movie]);

  // Dynamic document title
  useEffect(() => {
    if (movie?.title) {
      document.title = `${movie.title} | Dimm's Movie`;
    }
    return () => {
      document.title = "Dimm's Movie";
    };
  }, [movie]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <Spinner />
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
    <main className="min-h-screen bg-primary">
      {/* Video Background or Image Backdrop */}
      {trailer ? (
        <div className="video-backdrop">
          <iframe
            src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1&loop=1&playlist=${trailer.key}&controls=0&showinfo=0&rel=0&modestbranding=1`}
            title="Background Trailer"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
          <div className="backdrop-overlay" />
        </div>
      ) : (
        <div
          className="movie-backdrop"
          data-aos="fade"
          data-aos-duration="1200"
          style={{
            backgroundImage: backdrop_path
              ? `url(https://image.tmdb.org/t/p/original${backdrop_path})`
              : "none",
          }}
        >
          <div className="backdrop-overlay" />
        </div>
      )}

      <div className="movie-detail-wrapper">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="back-button"
          data-aos="fade-right"
          data-aos-delay="200"
        >
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
          <div className="movie-poster" data-aos="fade-right" data-aos-delay="50">
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
            <h1 className="movie-title" data-aos="fade-up" data-aos-delay="100">
              {title}
            </h1>
            {tagline && (
              <p className="movie-tagline" data-aos="fade-up" data-aos-delay="120">
                "{tagline}"
              </p>
            )}

            <div className="movie-meta" data-aos="fade-up" data-aos-delay="140">
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
            <div className="movie-genres" data-aos="fade-up" data-aos-delay="160">
              {genres?.map((genre) => (
                <span key={genre.id} className="genre-badge">
                  {genre.name}
                </span>
              ))}
            </div>

            {/* Overview */}
            <div className="movie-overview" data-aos="fade-up" data-aos-delay="180">
              <h3>Overview</h3>
              <p>{overview}</p>
            </div>

            {/* Cast */}
            {topCast.length > 0 && (
              <div className="movie-cast" data-aos="fade-up" data-aos-delay="200">
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

            {/* Trailer Video Player */}
            {trailer && (
              <div className="movie-trailer" data-aos="zoom-in" data-aos-delay="250">
                <h3>Watch Trailer</h3>
                <div className="video-container">
                  <iframe
                    src={`https://www.youtube.com/embed/${trailer.key}`}
                    title={`${title} Trailer`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default MovieDetail;
