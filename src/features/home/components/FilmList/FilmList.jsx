import React from "react";
import { useNavigate } from "react-router-dom";
import "./FilmList.css";

export default function FilmList({ title, films, useApi = false, type = "now-showing" }) {
  const navigate = useNavigate();

  // Format ngày tháng
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("vi-VN");
    } catch {
      return dateString; // Nếu là string format sẵn
    }
  };

  // Format genres
  const formatGenres = (genres) => {
    if (!genres) return "N/A";
    if (Array.isArray(genres)) {
      return genres.map((g) => g.genreName || g).join(", ");
    }
    return genres;
  };

  // Xử lý chọn phim
  const handleMovieClick = (movie) => {
    if (useApi && movie.id) {
      // Lưu movieId vào localStorage
      localStorage.setItem("selectedMovieId", movie.id);
      navigate(`/movie-detail/${movie.id}`);
    } else if (movie.id) {
      localStorage.setItem("selectedMovieId", movie.id);
      navigate(`/movie-detail/${movie.id}`);
    } else {
      navigate("/movie-detail");
    }
  };

  return (
    <div className="film-section">
      <div className="title">
        <div className="left-group">
          <div className="circle"></div>
          <h2>{title}</h2>
        </div>
        <span className="view-all">Xem tất cả</span>
      </div>

      <div className="film-list">
        {films && films.length > 0 ? (
          films.map((item, idx) => {
            const movieId = item.id || idx;
            const poster = item.image || item.poster || "/placeholder.jpg";
            const genres = useApi 
              ? formatGenres(item.genres) 
              : (Array.isArray(item.genres) ? item.genres.join(", ") : item.genres);
            const date = useApi 
              ? formatDate(item.releaseDate) 
              : item.date;

            return (
              <div
                key={movieId}
                className="card"
                onClick={() => handleMovieClick(item)}
                style={{ cursor: "pointer" }}
              >
                <img 
                  src={poster} 
                  alt={item.title}
                  onError={(e) => {
                    e.target.src = "/placeholder.jpg";
                  }}
                />
                <div className="des">
                  <p>{genres}</p>
                  <p>{date}</p>
                </div>
                <h4>{item.title}</h4>
              </div>
            );
          })
        ) : (
          <div style={{ textAlign: "center", padding: "40px", color: "#718096" }}>
            <p>Không có phim để hiển thị</p>
          </div>
        )}
      </div>
    </div>
  );
}
