import React from "react";
import "./PaymentInfo.css";

export default function PaymentInfo({ booking, movie, showtime, selectedSeats }) {
  if (!booking || !movie || !showtime) {
    return (
      <div className="payment-info-loading">
        <p>Đang tải thông tin...</p>
      </div>
    );
  }

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

  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // Loại bỏ duplicate ghế dựa trên id hoặc seatNumber
  const uniqueSeats = selectedSeats
    ? selectedSeats.filter((seat, index, self) => {
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
      })
    : [];

  const seatNumbers = uniqueSeats
    .map((s) => s.seatNumber || s.seatCode)
    .join(", ");

  return (
    <div className="payment-info">
      <div className="info-card">
        <h3>Thông tin phim</h3>
        <div className="movie-info">
          <div className="info-row">
            <span className="label">Phim</span>
            <span className="value">
              {movie.title || "N/A"}
              {movie.ageRating && ` - ${movie.ageRating}`}
            </span>
          </div>
          <div className="info-row">
            <span className="label">Ngày giờ chiếu</span>
            <span className="value highlight">
              {formatTime(showtime.startTime)} - {formatDate(showtime.startTime)}
            </span>
          </div>
          <div className="info-row">
            <span className="label">Định dạng</span>
            <span className="value">{movie.type || "2D"}</span>
          </div>
          <div className="info-row">
            <span className="label">Ghế</span>
            <span className="value">{seatNumbers || "N/A"}</span>
          </div>
          <div className="info-row">
            <span className="label">Phòng chiếu</span>
            <span className="value">
              {showtime.screen?.name || showtime.screenId || "N/A"}
            </span>
          </div>
        </div>
      </div>

      <div className="info-card">
        <h3>Thông tin thanh toán</h3>
        <div className="payment-table">
          <div className="table-header">
            <span>Danh mục</span>
            <span>Số lượng</span>
            <span>Tổng tiền</span>
          </div>
          <div className="table-row">
            <span>Ghế ({seatNumbers || "N/A"})</span>
            <span>{uniqueSeats.length || booking.totalSeat || 0}</span>
            <span>
              {(booking.totalPriceMovie || 0).toLocaleString("vi-VN")}₫
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
