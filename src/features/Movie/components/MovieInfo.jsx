import "./movie_info.css";

export default function MovieInfo({ movie, loading }) {
  // Default values nếu không có movie data
  const movieTitle = movie?.title || "Đang tải...";
  const movieType = movie?.type || "2D";
  const movieImage = movie?.image || movie?.poster || "/src/assets/cuoixuyenbiengioi.png";
  const genres = movie?.genres?.map((g) => g.genreName || g).join(", ") || "N/A";
  const origin = movie?.origin || "N/A";
  const duration = movie?.duration || 0;
  const director = movie?.director || "N/A";
  const cast = movie?.cast || "N/A";
  const releaseDate = movie?.releaseDate 
    ? new Date(movie.releaseDate).toLocaleDateString("vi-VN")
    : "N/A";
  const description = movie?.description || movie?.synopsis || "Đang tải mô tả phim...";
  const rating = movie?.rating || "T13";

  if (loading) {
    return (
      <section className="hero">
        <div className="overlay"></div>
        <div className="hero-content">
          <div style={{ textAlign: "center", padding: "100px 20px", color: "white" }}>
            <p>Đang tải thông tin phim...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="hero">
      <div className="overlay"></div>
      <div className="hero-content">
        <div className="main-content">
          <div className="top-row">
            <img
              src={movieImage}
              alt={movieTitle}
              onError={(e) => {
                e.target.src = "/src/assets/cuoixuyenbiengioi.png";
              }}
            />
            <div className="top-side">
              <h1>
                {movieTitle.toUpperCase()} <span className="tag">{movieType}</span>
              </h1>
              <p>
                {genres} &nbsp; | &nbsp; {origin} &nbsp; | &nbsp; {duration} phút
                &nbsp;&nbsp;&nbsp;
              </p>
            </div>
          </div>
        </div>

        <div className="movie-infor">
          <h1>
            {movieTitle.toUpperCase()} <span className="tag">{movieType}</span>
          </h1>
          <p className="meta">
            {genres} &nbsp; | &nbsp; {origin} &nbsp; | &nbsp; {duration} phút
            &nbsp;&nbsp;&nbsp; Đạo diễn: <strong>{director}</strong>
          </p>
          <p className="cast">Diễn viên: {cast}</p>
          <p>Khởi chiếu: {releaseDate}</p>
          <p className="desc">{description}</p>
          <p className="rating">
            <span className="highlight">
              Kiểm duyệt: {rating} - PHIM ĐƯỢC PHỔ BIẾN ĐẾN NGƯỜI XEM TỪ ĐỦ 13 TUỔI
              TRỞ LÊN (13+)
            </span>
          </p>
          <div className="actions">
            <button className="button btn-outline">Chi tiết nội dung</button>
            <button className="button btn-yellow">Xem trailer</button>
          </div>
        </div>
      </div>
    </section>
  );
}
