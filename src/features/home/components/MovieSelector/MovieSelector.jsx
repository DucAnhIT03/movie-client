import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import movieService from "../../../../services/movie/movieService";
import "./MovieSelector.css";

export default function MovieSelector({ title = "Phim đang chiếu", type = "now-showing", onMovieSelect }) {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let response;
        if (type === "now-showing") {
          response = await movieService.getNowShowing();
        } else if (type === "coming-soon") {
          response = await movieService.getComingSoon();
        } else {
          response = await movieService.getMovies();
        }

        if (response.status === 200 && response.data) {
          const moviesList = Array.isArray(response.data) 
            ? response.data 
            : response.data.items || [];
          setMovies(moviesList);
        } else {
          setError("Không thể tải danh sách phim");
        }
      } catch (err) {
        console.error("Error loading movies:", err);
        setError("Có lỗi xảy ra khi tải danh sách phim");
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, [type]);

  // Xử lý chọn phim
  const handleMovieSelect = (movie) => {
    // Lưu movieId vào localStorage
    localStorage.setItem("selectedMovieId", movie.id);
    
    // Gọi callback nếu có
    if (onMovieSelect) {
      onMovieSelect(movie);
    } else {
      // Default: navigate đến movie detail
      navigate(`/movie-detail/${movie.id}`);
    }
  };

  // Format ngày tháng
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("vi-VN");
    } catch {
      return "N/A";
    }
  };

  // Format genres
  const formatGenres = (genres) => {
    if (!genres || !Array.isArray(genres)) return "N/A";
    return genres.map((g) => g.genreName || g).join(", ");
  };

  if (loading) {
    return (
      <div className="movie-selector">
        <div className="movie-selector-header">
          <h2>{title}</h2>
        </div>
        <div className="loading-message">
          <p>Đang tải danh sách phim...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="movie-selector">
        <div className="movie-selector-header">
          <h2>{title}</h2>
        </div>
        <div className="error-message">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="movie-selector">
        <div className="movie-selector-header">
          <h2>{title}</h2>
        </div>
        <div className="empty-message">
          <p>Hiện tại không có phim {type === "now-showing" ? "đang chiếu" : "sắp chiếu"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="movie-selector">
      <div className="movie-selector-header">
        <div className="left-group">
          <div className="circle"></div>
          <h2>{title}</h2>
        </div>
        <span className="view-all">Xem tất cả</span>
      </div>

      <div className="movie-list">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="movie-card"
            onClick={() => handleMovieSelect(movie)}
          >
            <div className="movie-poster">
              <img
                src={movie.image || movie.poster || "/placeholder.jpg"}
                alt={movie.title}
                onError={(e) => {
                  e.target.src = "/placeholder.jpg";
                }}
              />
              {movie.type && (
                <span className="movie-type-badge">{movie.type}</span>
              )}
            </div>
            <div className="movie-info">
              <div className="movie-meta">
                <p className="movie-genres">{formatGenres(movie.genres)}</p>
                <p className="movie-date">
                  {formatDate(movie.releaseDate)}
                </p>
              </div>
              <h4 className="movie-title">{movie.title}</h4>
              {movie.duration && (
                <p className="movie-duration">{movie.duration} phút</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

