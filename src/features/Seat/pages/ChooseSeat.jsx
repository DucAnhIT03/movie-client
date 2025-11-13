import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../shared/layout/Header/Header";
import Footer from "../../../shared/layout/Footer/Footer";
import "./choose_seat.css";
import room from "../../../assets/room.png";
import { FaTimes } from "react-icons/fa";
import MovieInfo from "../../Movie/components/MovieInfo";
import ShowtimeSelector from "../../Movie/components/ShowtimeSelector/ShowtimeSelector";
import seatService from "../../../services/seat/seatService";
import bookingService from "../../../services/booking/bookingService";
import movieService from "../../../services/movie/movieService";
import showtimeService from "../../../services/showtime/showtimeService";

export default function ChooseSeat() {
  const navigate = useNavigate();
  const [selectedSeatIds, setSelectedSeatIds] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]); // Lưu thông tin ghế đã chọn
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showtimeId, setShowtimeId] = useState(null);
  const [showtime, setShowtime] = useState(null);
  const [movie, setMovie] = useState(null);
  const [screen, setScreen] = useState(null);
  const [creatingBooking, setCreatingBooking] = useState(false);

  // Load showtimeId từ localStorage
  useEffect(() => {
    const savedShowtimeId = localStorage.getItem("selectedShowtimeId");
    if (savedShowtimeId) {
      setShowtimeId(parseInt(savedShowtimeId));
    } else {
      setError("Vui lòng chọn suất chiếu trước");
      setLoading(false);
    }
  }, []);

  // Load thông tin showtime và movie
  useEffect(() => {
    const loadShowtimeInfo = async () => {
      if (!showtimeId) return;

      try {
        const showtimeRes = await showtimeService.getShowtimeById(showtimeId);
        if (showtimeRes.status === 200 && showtimeRes.data) {
          const st = showtimeRes.data;
          setShowtime(st);
          setScreen(st.screen);

          // Load thông tin phim
          if (st.movieId) {
            const movieRes = await movieService.getMovieById(st.movieId);
            if (movieRes.status === 200 && movieRes.data) {
              setMovie(movieRes.data);
            }
          }
        }
      } catch (err) {
        console.error("Error loading showtime info:", err);
      }
    };

    loadShowtimeInfo();
  }, [showtimeId]);

  // Load ghế từ API
  useEffect(() => {
    const loadSeats = async () => {
      if (!showtimeId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await seatService.getSeatsByShowtime(showtimeId);

        if (response.status === 200 && response.data) {
          const seatsData = response.data;
          
          // Nhóm ghế theo hàng (dựa vào seatNumber)
          const groupedSeats = {};
          seatsData.forEach((seat) => {
            const row = seat.seatNumber?.charAt(0) || "A";
            if (!groupedSeats[row]) {
              groupedSeats[row] = [];
            }
            groupedSeats[row].push({
              ...seat,
              seatCode: seat.seatNumber,
              booked: seat.isBooked,
            });
          });

          // Sắp xếp theo hàng và số ghế
          const sortedRows = Object.keys(groupedSeats).sort();
          const seatRows = sortedRows.map((row) =>
            groupedSeats[row].sort((a, b) => {
              const numA = parseInt(a.seatNumber?.substring(1) || "0");
              const numB = parseInt(b.seatNumber?.substring(1) || "0");
              return numA - numB;
            })
          );

          setSeats(seatRows);
        } else {
          setError("Không thể tải danh sách ghế");
        }
      } catch (err) {
        console.error("Error loading seats:", err);
        setError("Có lỗi xảy ra khi tải danh sách ghế");
      } finally {
        setLoading(false);
      }
    };

    loadSeats();
  }, [showtimeId]);

  const toggleSeat = (seat) => {
    if (seat.booked || seat.isBooked) return;

    setSelectedSeatIds((prev) => {
      if (prev.includes(seat.id)) {
        // Bỏ chọn
        setSelectedSeats((prevSeats) =>
          prevSeats.filter((s) => s.id !== seat.id)
        );
        return prev.filter((id) => id !== seat.id);
      } else {
        // Chọn - kiểm tra xem ghế đã được chọn chưa để tránh duplicate
        setSelectedSeats((prevSeats) => {
          // Kiểm tra xem ghế đã có trong danh sách chưa (dựa trên id hoặc seatNumber)
          const isDuplicate = prevSeats.some(
            (s) =>
              s.id === seat.id ||
              (s.seatNumber || s.seatCode) === (seat.seatNumber || seat.seatCode)
          );
          if (isDuplicate) {
            return prevSeats; // Không thêm nếu đã có
          }
          return [...prevSeats, seat];
        });
        return [...prev, seat.id];
      }
    });
  };

  // Tính tổng tiền
  const totalPrice = selectedSeats.reduce((sum, seat) => {
    return sum + (seat.price || 0);
  }, 0);

  // Xử lý thanh toán
  const handlePayment = async () => {
    if (selectedSeatIds.length === 0) {
      alert("Vui lòng chọn ít nhất một ghế");
      return;
    }

    if (!showtimeId) {
      alert("Không tìm thấy thông tin suất chiếu");
      return;
    }

    // Kiểm tra đăng nhập
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("Vui lòng đăng nhập để đặt vé");
      navigate("/login");
      return;
    }

    try {
      setCreatingBooking(true);
      const bookingData = {
        showtimeId: showtimeId,
        seatIds: selectedSeatIds,
        totalPriceMovie: totalPrice,
      };

      const response = await bookingService.createBooking(bookingData);

      if (response.status === 201 && response.data) {
        // Loại bỏ duplicate ghế trước khi lưu
        const uniqueSeats = selectedSeats.filter((seat, index, self) => {
          const seatId = seat.id;
          const seatNumber = seat.seatNumber || seat.seatCode;
          return (
            index ===
            self.findIndex(
              (s) =>
                (s.id && s.id === seatId) ||
                (s.seatNumber || s.seatCode) === seatNumber
            )
          );
        });
        
        const uniqueSeatIds = uniqueSeats.map((s) => s.id).filter(Boolean);
        
        // Lưu bookingId để thanh toán
        localStorage.setItem("bookingId", response.data.id);
        localStorage.setItem("selectedSeatIds", JSON.stringify(uniqueSeatIds));
        localStorage.setItem("selectedSeats", JSON.stringify(uniqueSeats));
        
        // Navigate đến trang thanh toán
        navigate("/payment");
      } else if (response.status === 401) {
        alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        navigate("/login");
      } else {
        alert(
          response.data?.message ||
            "Có lỗi xảy ra khi đặt vé. Vui lòng thử lại."
        );
      }
    } catch (err) {
      console.error("Error creating booking:", err);
      alert("Có lỗi xảy ra khi đặt vé. Vui lòng thử lại.");
    } finally {
      setCreatingBooking(false);
    }
  };

  // Format thời gian
  const formatTime = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div style={{ textAlign: "center", padding: "100px 20px" }}>
          <p>Đang tải sơ đồ ghế...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (error && !showtimeId) {
    return (
      <>
        <Header />
        <div style={{ textAlign: "center", padding: "100px 20px" }}>
          <p style={{ color: "#e53e3e" }}>{error}</p>
          <button
            onClick={() => navigate(-1)}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              background: "#667eea",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Quay lại
          </button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <MovieInfo movie={movie} loading={!movie} />
      {showtimeId && (
        <ShowtimeSelector
          movieId={movie?.id || localStorage.getItem("selectedMovieId")}
          onSelectShowtime={(st) => {
            setShowtimeId(st.id);
            localStorage.setItem("selectedShowtimeId", st.id);
            localStorage.setItem("selectedTime", formatTime(st.startTime));
            setSelectedSeatIds([]);
            setSelectedSeats([]);
          }}
        />
      )}
      <section className="seat-section">
        <div className="container">
          <div className="seat-header">
            <p>
              Giờ chiếu: <strong>{formatTime(showtime?.startTime)}</strong>
            </p>
            <p className="seat-picker">
              {showtime?.startTime
                ? new Date(showtime.startTime).toLocaleDateString("vi-VN")
                : ""}
            </p>
          </div>

          <div className="screen">
            <img src={room} alt="room" />
          </div>

          <h2>{screen?.name || "Phòng chiếu"}</h2>
          <br />
          {error ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#e53e3e" }}>
              <p>{error}</p>
            </div>
          ) : (
            <div className="seat-grid">
              {seats.map((row, idx) => (
                <div className="seat-row" key={idx}>
                  {row.map((seat) => {
                    const isSelected = selectedSeatIds.includes(seat.id);
                    const isBooked = seat.booked || seat.isBooked;
                    // Map seatType từ API (STANDARD, VIP, SWEETBOX) sang CSS class
                    let seatTypeClass = "normal";
                    if (seat.seatType || seat.type) {
                      const type = (seat.seatType || seat.type).toUpperCase();
                      if (type === "VIP") {
                        seatTypeClass = "vip";
                      } else if (type === "SWEETBOX" || type === "DOUBLE") {
                        seatTypeClass = "double";
                      } else {
                        seatTypeClass = "normal";
                      }
                    }

                    return (
                      <button
                        key={seat.id}
                        className={`seat ${seatTypeClass} ${
                          isBooked ? "booked" : ""
                        } ${isSelected ? "selected" : ""}`}
                        onClick={() => toggleSeat(seat)}
                        disabled={isBooked}
                        title={
                          isBooked
                            ? "Ghế đã được đặt"
                            : `Ghế ${seat.seatNumber} - ${(
                                seat.price || 0
                              ).toLocaleString("vi-VN")}đ`
                        }
                      >
                        {isBooked ? (
                          <FaTimes size={16} />
                        ) : (
                          seat.seatNumber || seat.seatCode
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          )}

          <div className="legend">
            <div className="legend-item">
              <span className="seat booked">
                <FaTimes size={16} />
              </span>
              <span>Đã đặt</span>
            </div>
            <div className="legend-item">
              <span className="seat selected"></span>
              <span>Ghế bạn chọn</span>
            </div>
            <div className="legend-item">
              <span className="seat normal"></span>
              <span>Ghế thường</span>
            </div>
            <div className="legend-item">
              <span className="seat vip"></span>
              <span>Ghế VIP</span>
            </div>
            <div className="legend-item">
              <span className="seat double"></span>
              <span>Ghế đôi</span>
            </div>
          </div>

          <div className="summary">
            <div className="seat-choosed">
              <p>
                Ghế đã chọn:{" "}
                <span>
                  {selectedSeats.length > 0
                    ? selectedSeats.map((s) => s.seatNumber || s.seatCode).join(", ")
                    : "Chưa chọn"}
                </span>
              </p>
              <p>
                Tổng tiền:{" "}
                <span>
                  {totalPrice.toLocaleString("vi-VN")}đ
                </span>
              </p>
            </div>
            <div className="actions">
              <button
                className="button btn-outline"
                onClick={() => navigate(-1)}
              >
                Quay lại
              </button>
              <button
                className="button btn-red"
                onClick={handlePayment}
                disabled={creatingBooking || selectedSeatIds.length === 0}
              >
                {creatingBooking ? "Đang xử lý..." : "Thanh Toán"}
              </button>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
