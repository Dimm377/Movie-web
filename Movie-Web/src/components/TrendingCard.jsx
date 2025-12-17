import { Link } from "react-router-dom";

const TrendingCard = ({ movie, index }) => {
  const { id, title, poster_path } = movie;

  return (
    <div 
      className="trending-card-item"
      data-aos="fade-up"
      data-aos-delay={index * 100}
    >
      <Link to={`/movie/${id}`} className="trending-card">
        <p className="fancy-text">{index + 1}</p>
        <div className="poster-container">
          <img
            src={
              poster_path
                ? `https://image.tmdb.org/t/p/w500${poster_path}`
                : "/no-movie.png"
            }
            alt={title}
            loading="lazy"
            onError={(e) => {
              e.target.src = "/no-movie.png";
            }}
          />
          <h4 className="poster-title">{title}</h4>
        </div>
      </Link>
    </div>
  );
};

export default TrendingCard;
