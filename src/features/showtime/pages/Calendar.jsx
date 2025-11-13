import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Calendar.css";
import Header from "../../../shared/layout/Header/Header.jsx";
import Footer from "../../../shared/layout/Footer/Footer.jsx";
import movieService from "../../../services/movie/movieService.js";
import showtimeService from "../../../services/showtime/showtimeService.js";
import ShowtimeSelector from "../../Movie/components/ShowtimeSelector/ShowtimeSelector.jsx";

// Component MovieCard để hiển thị từng phim
function MovieCard({ movie, selectedDate, onSelectShowtime }) {
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadShowtimes = async () => {
      try {
        setLoading(true);
        const apiDate = formatDateForAPI(selectedDate);
        const response = await showtimeService.getShowtimesByDate(apiDate);
        
        if (response.status === 200 && response.data) {
          const showtimesList = Array.isArray(response.data)
            ? response.data
            : response.data.items || [];
          
          // Lọc showtime của phim này
          const movieShowtimes = showtimesList.filter(
            st => (st.movieId || st.movie?.id) === movie.id
          );
          
          // Sắp xếp theo thời gian
          movieShowtimes.sort((a, b) => 
            new Date(a.startTime) - new Date(b.startTime)
          );
          
          setShowtimes(movieShowtimes);
        }
      } catch (error) {
        console.error("Error loading showtimes:", error);
        setShowtimes([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadShowtimes();
  }, [movie.id, selectedDate]);

  const getGenreName = () => {
    if (movie.genres && movie.genres.length > 0) {
      const genreNames = movie.genres
        .map(g => g.genreName || g.name)
        .filter(Boolean);
      return genreNames.length > 0 ? genreNames.join(", ") : "N/A";
    }
    if (movie.movieGenres && movie.movieGenres.length > 0) {
      const genreNames = movie.movieGenres
        .map(mg => mg.genre?.genreName || mg.genreName)
        .filter(Boolean);
      return genreNames.length > 0 ? genreNames.join(", ") : "N/A";
    }
    return "N/A";
  };

  const getAgeRatingText = (rating) => {
    const ratings = {
      'K': 'Phim được phổ biến đến người xem dưới 13 tuổi và có người bảo hộ đi kèm',
      'T13': 'Phim được phổ biến đến người xem từ đủ 13 tuổi trở lên (13+)',
      'T16': 'Phim được phổ biến đến người xem từ đủ 16 tuổi trở lên (16+)',
      'T18': 'Phim được phổ biến đến người xem từ đủ 18 tuổi trở lên (18+)',
    };
    return ratings[rating] || '';
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  return (
    <div className="movie-card">
      <div className="poster-container">
        <img
          src={movie.image || movie.poster || "/placeholder.jpg"}
          alt={movie.title}
          className="poster"
          onError={(e) => {
            e.target.src = "/placeholder.jpg";
          }}
        />
      </div>
      <div className="movie-details">
        <div className="movie-details-header">
          <div className="movie-genre-duration">
            <span className="movie-genre">{getGenreName() || "N/A"}</span>
            {movie.duration && (
              <span className="movie-duration">{movie.duration} phút</span>
            )}
          </div>
          <div className="movie-type-badge">{movie.type || '2D'}</div>
        </div>
        <h2 className="movie-title">
          {movie.title || "N/A"}
          {movie.ageRating && `-${movie.ageRating}`}
          {movie.subtitle && ` - ${movie.subtitle}`}
        </h2>
        {movie.origin && (
          <p className="movie-origin">Xuất xứ: {movie.origin}</p>
        )}
        {movie.release_date && (
          <p className="movie-release-date">
            Khởi chiếu: {new Date(movie.release_date).toLocaleDateString("vi-VN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric"
            })}
          </p>
        )}
        {movie.ageRating && (
          <p className="movie-age-rating">
            {movie.ageRating} - {getAgeRatingText(movie.ageRating)}
          </p>
        )}
        
        <div className="showtimes-section">
          {loading ? (
            <div className="showtimes-loading">Đang tải...</div>
          ) : showtimes.length > 0 ? (
            <div className="showtimes-list">
              {showtimes.map((st) => (
                <button
                  key={st.id}
                  className="showtime-btn"
                  onClick={() => onSelectShowtime(st)}
                >
                  {formatTime(st.startTime)}
                </button>
              ))}
            </div>
          ) : (
            <div className="no-showtimes">Không có suất chiếu</div>
          )}
        </div>
      </div>
    </div>
  );
}

// Format date từ Date object sang DD-MM-YYYY
function formatDateForDisplay(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

// Format date từ DD-MM-YYYY sang YYYY-MM-DD cho API
function formatDateForAPI(dateStr) {
  const [day, month, year] = dateStr.split("-");
  return `${year}-${month}-${day}`;
}

// Format thời gian từ Date object
function formatTime(dateStr) {
  const date = new Date(dateStr);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

function Calendar() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return formatDateForDisplay(today);
  });

  // Tạo danh sách 7 ngày từ hôm nay
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return formatDateForDisplay(date);
  });

  // Load danh sách phim có showtime trong ngày được chọn
  useEffect(() => {
    const loadMoviesByDate = async () => {
      try {
        setLoading(true);
        const apiDate = formatDateForAPI(selectedDate);
        
        // Lấy showtime theo ngày (API đã include thông tin phim)
        const showtimesResponse = await showtimeService.getShowtimesByDate(apiDate);
        
        if (showtimesResponse.status === 200 && showtimesResponse.data) {
          const showtimesList = Array.isArray(showtimesResponse.data)
            ? showtimesResponse.data
            : showtimesResponse.data.items || [];
          
          if (showtimesList.length === 0) {
            setMovies([]);
            setLoading(false);
            return;
          }
          
          // Lấy danh sách phim unique từ showtime (showtime đã có thông tin phim)
          const moviesMap = new Map();
          
          showtimesList.forEach((st) => {
            const movie = st.movie || st.movieId;
            if (movie) {
              const movieId = movie.id || movie;
              if (!moviesMap.has(movieId)) {
                // Lưu thông tin phim từ showtime
                const movieData = typeof movie === 'object' ? movie : null;
                if (movieData) {
                  moviesMap.set(movieId, movieData);
                }
              }
            }
          });
          
          // Nếu không có thông tin phim trong showtime, load từ API
          const moviesArray = Array.from(moviesMap.values());
          
          if (moviesArray.length === 0) {
            // Fallback: Lấy movieId và load từ API
            const movieIds = [...new Set(showtimesList.map(st => st.movieId || st.movie?.id).filter(Boolean))];
            
            if (movieIds.length > 0) {
              const moviesPromises = movieIds.map(async (movieId) => {
                try {
                  const movieResponse = await movieService.getMovieById(movieId);
                  if (movieResponse.status === 200 && movieResponse.data) {
                    return movieResponse.data;
                  }
                  return null;
                } catch (error) {
                  console.error(`Error loading movie ${movieId}:`, error);
                  return null;
                }
              });
              
              const moviesData = await Promise.all(moviesPromises);
              const validMovies = moviesData.filter(movie => movie !== null);
              
              // Sắp xếp theo thứ tự showtime (phim có showtime sớm nhất trước)
              validMovies.sort((a, b) => {
                const aShowtimes = showtimesList.filter(st => (st.movieId || st.movie?.id) === a.id);
                const bShowtimes = showtimesList.filter(st => (st.movieId || st.movie?.id) === b.id);
                if (aShowtimes.length === 0 || bShowtimes.length === 0) return 0;
                const aEarliest = new Date(Math.min(...aShowtimes.map(st => new Date(st.startTime).getTime())));
                const bEarliest = new Date(Math.min(...bShowtimes.map(st => new Date(st.startTime).getTime())));
                return aEarliest - bEarliest;
              });
              
              setMovies(validMovies);
            } else {
              setMovies([]);
            }
          } else {
            // Sắp xếp theo thứ tự showtime (phim có showtime sớm nhất trước)
            moviesArray.sort((a, b) => {
              const aShowtimes = showtimesList.filter(st => (st.movieId || st.movie?.id) === (a.id || a));
              const bShowtimes = showtimesList.filter(st => (st.movieId || st.movie?.id) === (b.id || b));
              if (aShowtimes.length === 0 || bShowtimes.length === 0) return 0;
              const aEarliest = new Date(Math.min(...aShowtimes.map(st => new Date(st.startTime).getTime())));
              const bEarliest = new Date(Math.min(...bShowtimes.map(st => new Date(st.startTime).getTime())));
              return aEarliest - bEarliest;
            });
            
            setMovies(moviesArray);
          }
        } else {
          setMovies([]);
        }
      } catch (error) {
        console.error("Error loading movies by date:", error);
        console.error("Error details:", error.response?.data || error.message);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadMoviesByDate();
  }, [selectedDate]);

  // Xử lý chọn showtime
  const handleSelectShowtime = (showtime) => {
    localStorage.setItem("selectedShowtimeId", showtime.id);
    localStorage.setItem("selectedTime", formatTime(showtime.startTime));
    localStorage.setItem("selectedMovieId", showtime.movieId);
    localStorage.setItem("selectedScreenId", showtime.screenId || showtime.screen?.id);
    navigate("/choose-seat");
  };

  return (
    <div className="calendar-page">
      <Header />

      <div className="app">
        <h1 className="movie-title">
          <span className="title-dot"></span>Phim đang chiếu
        </h1>

        <div className="date-buttons">
          {dates.map((d) => (
            <button
              key={d}
              className={`date-btn ${selectedDate === d ? "active" : ""}`}
              onClick={() => setSelectedDate(d)}
            >
              {d}
            </button>
          ))}
        </div>

        <p className="note">
          <span className="note-label">Lưu ý:</span> Khán giả dưới 13 tuổi chỉ
          chọn suất chiếu kết thúc trước 22h và dưới 16 tuổi chỉ chọn suất chiếu
          kết thúc trước 23h.
        </p>

        {loading ? (
          <div style={{ textAlign: "center", color: "white", padding: "40px" }}>
            Đang tải...
          </div>
        ) : (
          <div className="movie-list">
            {movies.length === 0 ? (
              <div style={{ textAlign: "center", color: "white", padding: "40px" }}>
                Không có phim đang chiếu
              </div>
            ) : (
              movies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  selectedDate={selectedDate}
                  onSelectShowtime={handleSelectShowtime}
                />
              ))
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default Calendar;
