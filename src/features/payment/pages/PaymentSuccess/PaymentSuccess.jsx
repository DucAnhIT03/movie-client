import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./PaymentSuccess.css";
import Header from "../../../../shared/layout/Header/Header";
import Footer from "../../../../shared/layout/Footer/Footer";
import { FaStar } from "react-icons/fa";

export default function PaymentSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Clear any remaining booking data
    localStorage.removeItem("bookingId");
    localStorage.removeItem("selectedSeatIds");
    localStorage.removeItem("selectedSeats");
    localStorage.removeItem("selectedShowtimeId");
    localStorage.removeItem("selectedTime");
    localStorage.removeItem("selectedMovieId");
    localStorage.removeItem("selectedScreenId");
  }, []);

  const handleGoHome = () => {
    navigate("/");
  };

  const handleViewTickets = () => {
    navigate("/profile");
  };

  return (
    <div className="payment-success-wrapper">
      <Header />

      <main className="success-content">
        <div className="success-container">
          <div className="success-icon">
            <FaStar className="star-icon" />
            <div className="sparkles">
              <div className="sparkle sparkle-1"></div>
              <div className="sparkle sparkle-2"></div>
              <div className="sparkle sparkle-3"></div>
              <div className="sparkle sparkle-4"></div>
              <div className="sparkle sparkle-5"></div>
              <div className="sparkle sparkle-6"></div>
            </div>
          </div>

          <h1 className="success-title">Đặt vé thành công!</h1>

          {location.state?.paymentId && (
            <p className="success-payment-id">
              Mã thanh toán: {location.state.paymentId}
            </p>
          )}

          <p className="success-note">
            Lưu ý: Hãy đến đúng giờ của suất chiếu và tận hưởng bộ phim
          </p>

          <div className="success-actions">
            <button className="btn-view-tickets" onClick={handleViewTickets}>
              Xem vé của tôi
            </button>
            <button className="btn-go-home" onClick={handleGoHome}>
              Về trang chủ
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
