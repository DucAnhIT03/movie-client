import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./PaymentFailure.css";
import Header from "../../../../shared/layout/Header/Header";
import Footer from "../../../../shared/layout/Footer/Footer";
import { FaTimesCircle } from "react-icons/fa";

export default function PaymentFailurePage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Optionally clear booking data on failure
    // Keep it so user can retry payment
  }, []);

  const handleGoHome = () => {
    // Clear booking data when going home
    localStorage.removeItem("bookingId");
    localStorage.removeItem("selectedSeatIds");
    localStorage.removeItem("selectedSeats");
    localStorage.removeItem("selectedShowtimeId");
    localStorage.removeItem("selectedTime");
    localStorage.removeItem("selectedMovieId");
    localStorage.removeItem("selectedScreenId");
    navigate("/");
  };

  const handleTryAgain = () => {
    // Navigate back to payment page
    navigate("/payment");
  };

  return (
    <div className="payment-failure-wrapper">
      <Header />

      <main className="failure-content">
        <div className="failure-container">
          <div className="failure-icon">
            <FaTimesCircle className="error-icon" />
          </div>

          <h1 className="failure-title">Thanh toán thất bại!</h1>

          <p className="failure-note">
            Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại hoặc chọn
            phương thức thanh toán khác.
          </p>

          <div className="action-buttons">
            <button className="btn-try-again" onClick={handleTryAgain}>
              Thử lại
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
