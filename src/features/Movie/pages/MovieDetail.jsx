import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../../shared/layout/Header/Header";
import Footer from "../../../shared/layout/Footer/Footer";
import MovieInfo from "../components/MovieInfo";
import ShowtimeSelector from "../components/ShowtimeSelector/ShowtimeSelector";
import movieService from "../../../services/movie/movieService";
import "./movie_detail.css";

export default function MovieDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [movieId, setMovieId] = useState(id ? parseInt(id) : null);
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  // Lấy movieId từ URL params hoặc localStorage hoặc state
  useEffect(() => {
    if (id) {
      setMovieId(parseInt(id));
    } else {
      // Thử lấy từ localStorage nếu có
      const savedMovieId = localStorage.getItem("selectedMovieId");
      if (savedMovieId) {
        setMovieId(parseInt(savedMovieId));
      }
    }
  }, [id]);

  // Load thông tin phim nếu có movieId
  useEffect(() => {
    const loadMovie = async () => {
      if (!movieId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await movieService.getMovieById(movieId);
        if (response.status === 200 && response.data) {
          setMovie(response.data);
        }
      } catch (error) {
        console.error("Error loading movie:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMovie();
  }, [movieId]);

  // Xử lý chọn showtime
  const handleSelectShowtime = (showtime) => {
    localStorage.setItem("selectedShowtimeId", showtime.id);
    localStorage.setItem("selectedTime", new Date(showtime.startTime).toLocaleTimeString("vi-VN", { 
      hour: "2-digit", 
      minute: "2-digit" 
    }));
    localStorage.setItem("selectedMovieId", showtime.movieId);
    localStorage.setItem("selectedScreenId", showtime.screenId || showtime.screen?.id);
    navigate("/choose-seat");
  };

  return (
    <>
      <Header />
      <MovieInfo movie={movie} movieId={movieId} loading={loading} />
      <section className="schedule">
        <div className="container">
          {movieId ? (
            <ShowtimeSelector 
              movieId={movieId} 
              onSelectShowtime={handleSelectShowtime}
            />
          ) : (
            <div style={{ textAlign: "center", padding: "40px", color: "#718096" }}>
              <p>Vui lòng chọn phim để xem lịch chiếu</p>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}
