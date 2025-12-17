import { Link } from "react-router-dom";

const TrendingCard = ({ movie, index }) => {
  const { id, title, poster_path } = movie;

  return (
    <li>
      <Link to={`/movie/${id}`} className="trending-card">
        <p className="fancy-text">{index + 1}</p>
        <img
          src={
            poster_path
              ? `https://image.tmdb.org/t/p/w500${poster_path}`
              : "/no-movie.png"
          }
          alt={title}
        />
      </Link>
    </li>
  );
};

export default TrendingCard;
