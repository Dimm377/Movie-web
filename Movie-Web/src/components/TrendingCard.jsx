import { Link } from "react-router-dom";
import { movieService } from "../utils/api.js";

const TrendingCard = ({ movie, index }) => {
  const { id, title, poster_path } = movie;

  return (
    <div 
      className="trending-card-item"
      data-aos="fade-up"
      data-aos-delay={index * 100}
    >
      <Link to={`/movie/${id}`} className="trending-card">
        <p className="fancy-text" aria-label={`Trending rank #${index + 1}`}>{index + 1}</p>
        <div className="poster-container">
          <img
            src={movieService.getImageUrl(poster_path, "w500")}
            alt={title}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = "/no-movie.png";
            }}
          />
          <h4 className="poster-title">{title}</h4>
        </div>
      </Link>
    </div>
  );
};

export default TrendingCard;
