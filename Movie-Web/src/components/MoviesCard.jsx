import { Link } from "react-router-dom";
import { movieService } from "../utils/api.js";

const MoviesCard = ({
  movie: {
    id,
    title,
    poster_path,
    vote_average,
    release_date,
    original_language,
  },
  index,
}) => {
  return (
    <Link
      to={`/movie/${id}`}
      className="movie-card"
      data-aos="fade-up"
      data-aos-delay={index < 8 ? index * 50 : 0}
    >
      <img
        src={movieService.getImageUrl(poster_path, "w500")}
        alt={title}
        loading="lazy"
        onError={(e) => {
          e.currentTarget.src = "/no-movie.png";
        }}
      />
      <div className="mt-4" />
      <h3 className="text-white font-semibold text-lg">{title}</h3>

      <div className="content">
        <div className="rating">
          <img src="/star.svg" alt="rating" />
          <p>{vote_average ? vote_average.toFixed(1) : "N/A"}</p>
        </div>
        <span>•</span>
        <p className="lang">{original_language}</p>
        <span>•</span>
        <p className="year">{release_date ? release_date.split("-")[0] : "N/A"}</p>
      </div>
    </Link>
  );
};

export default MoviesCard;
