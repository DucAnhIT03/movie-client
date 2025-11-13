import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Payment.css";
import Header from "../../../../shared/layout/Header/Header";
import Footer from "../../../../shared/layout/Footer/Footer";
import PaymentMethodSelector from "../../components/PaymentMethodSelector/PaymentMethodSelector";
import PaymentInfo from "../../components/PaymentInfo/PaymentInfo";
import QRCodeModal from "../../components/QRCodeModal/QRCodeModal";
import paymentService from "../../../../services/payment/paymentService";
import bookingService from "../../../../services/booking/bookingService";
import showtimeService from "../../../../services/showtime/showtimeService";
import movieService from "../../../../services/movie/movieService";

export default function PaymentPage() {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState("VIETQR");
  const [showQRModal, setShowQRModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  // Data states
  const [booking, setBooking] = useState(null);
  const [movie, setMovie] = useState(null);
  const [showtime, setShowtime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [payment, setPayment] = useState(null);
  const [paymentUrl, setPaymentUrl] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [pollingInterval, setPollingInterval] = useState(null);

  // Load booking data from localStorage and API
  useEffect(() => {
    const loadBookingData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get bookingId from localStorage
        const bookingId = localStorage.getItem("bookingId");
        if (!bookingId) {
          setError("Không tìm thấy thông tin đặt vé. Vui lòng đặt vé lại.");
          setLoading(false);
          return;
        }

        // Get selected seats from localStorage
        const savedSeats = localStorage.getItem("selectedSeats");
        if (savedSeats) {
          try {
            const parsedSeats = JSON.parse(savedSeats);
            // Loại bỏ duplicate ghế dựa trên id hoặc seatNumber
            const uniqueSeats = parsedSeats.filter((seat, index, self) => {
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
            setSelectedSeats(uniqueSeats);
          } catch (e) {
            console.error("Error parsing selected seats:", e);
          }
        }

        // Create a simple booking object from localStorage data
        // In a real scenario, you might want to fetch booking details from API
        const savedSeatIds = localStorage.getItem("selectedSeatIds");
        let parsedSeats = [];
        if (savedSeats) {
          try {
            parsedSeats = JSON.parse(savedSeats);
            // Loại bỏ duplicate
            parsedSeats = parsedSeats.filter((seat, index, self) => {
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
          } catch (e) {
            console.error("Error parsing seats for booking:", e);
          }
        }
        const bookingData = {
          id: parseInt(bookingId),
          totalSeat: parsedSeats.length,
          totalPriceMovie: parsedSeats.reduce(
            (sum, seat) => sum + (seat.price || 0),
            0
          ),
        };
        setBooking(bookingData);

        // Load showtime info
        const showtimeId = localStorage.getItem("selectedShowtimeId");
        if (showtimeId) {
          const showtimeRes = await showtimeService.getShowtimeById(
            parseInt(showtimeId)
          );
          if (showtimeRes.status === 200 && showtimeRes.data) {
            const st = showtimeRes.data;
            setShowtime(st);

            // Load movie info
            if (st.movieId || st.movie?.id) {
              const movieId = st.movieId || st.movie.id;
              const movieRes = await movieService.getMovieById(movieId);
              if (movieRes.status === 200 && movieRes.data) {
                setMovie(movieRes.data);
              }
            }
          }
        }
      } catch (err) {
        console.error("Error loading booking data:", err);
        setError("Có lỗi xảy ra khi tải thông tin đặt vé.");
      } finally {
        setLoading(false);
      }
    };

    loadBookingData();
  }, []);

  // Handle payment
  const handlePayment = async () => {
    if (!booking) {
      alert("Không tìm thấy thông tin đặt vé.");
      return;
    }

    if (!selectedMethod) {
      alert("Vui lòng chọn phương thức thanh toán.");
      return;
    }

    try {
      setProcessing(true);
      setError(null);

      // Create payment
      const paymentData = {
        bookingId: booking.id,
        method: selectedMethod,
        amount: booking.totalPriceMovie,
      };

      const response = await paymentService.createPayment(paymentData);

      if (response.status === 201 && response.data) {
        const createdPayment = response.data;
        setPayment(createdPayment);
        setPaymentUrl(createdPayment.payment_url);
        setQrCode(createdPayment.qr_code);
        setShowQRModal(true);
        
        // Bắt đầu polling để kiểm tra trạng thái thanh toán
        startPolling(createdPayment.id);
      } else if (response.status === 401) {
        alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        navigate("/login");
      } else {
        const errorMsg =
          response.data?.message ||
          "Có lỗi xảy ra khi tạo thanh toán. Vui lòng thử lại.";
        setError(errorMsg);
        alert(errorMsg);
      }
    } catch (err) {
      console.error("Error creating payment:", err);
      const errorMsg =
        err.response?.data?.message ||
        "Có lỗi xảy ra khi tạo thanh toán. Vui lòng thử lại.";
      setError(errorMsg);
      alert(errorMsg);
    } finally {
      setProcessing(false);
    }
  };

  // Polling để kiểm tra trạng thái thanh toán
  const startPolling = (paymentId) => {
    // Dừng polling cũ nếu có
    if (pollingInterval) {
      clearInterval(pollingInterval);
    }

    const interval = setInterval(async () => {
      try {
        const response = await paymentService.getPayment(paymentId);
        if (response.status === 200 && response.data) {
          const paymentStatus = response.data.payment_status;
          
          if (paymentStatus === "COMPLETED") {
            // Thanh toán thành công
            clearInterval(interval);
            setPollingInterval(null);
            handlePaymentCompleted(paymentId);
          } else if (paymentStatus === "FAILED" || paymentStatus === "CANCELLED") {
            // Thanh toán thất bại
            clearInterval(interval);
            setPollingInterval(null);
            handlePaymentFailed();
          }
          // Nếu vẫn PENDING, tiếp tục polling
        }
      } catch (err) {
        console.error("Error polling payment status:", err);
      }
    }, 3000); // Poll mỗi 3 giây

    setPollingInterval(interval);

    // Dừng polling sau 15 phút
    setTimeout(() => {
      if (interval) {
        clearInterval(interval);
        setPollingInterval(null);
      }
    }, 15 * 60 * 1000);
  };

  // Xử lý khi thanh toán hoàn tất
  const handlePaymentCompleted = (paymentId) => {
    // Clear localStorage
    localStorage.removeItem("bookingId");
    localStorage.removeItem("selectedSeatIds");
    localStorage.removeItem("selectedSeats");
    localStorage.removeItem("selectedShowtimeId");
    localStorage.removeItem("selectedTime");
    localStorage.removeItem("selectedMovieId");
    localStorage.removeItem("selectedScreenId");

    setShowQRModal(false);
    navigate("/payment-success", {
      state: { paymentId },
    });
  };

  // Xử lý khi thanh toán thất bại
  const handlePaymentFailed = () => {
    setShowQRModal(false);
    navigate("/payment-failure");
  };

  // Handle payment success (manual confirm cho các phương thức không có webhook)
  const handlePaymentSuccess = async () => {
    // Chỉ dùng cho các phương thức không có webhook tự động
    // Với VNPAY, VietQR có webhook nên không cần manual confirm
    if (selectedMethod === "VNPAY" || selectedMethod === "VIETQR") {
      // Đã có polling, không cần manual confirm
      return;
    }

    if (!payment) {
    navigate("/payment-success");
      return;
    }

    try {
      setProcessing(true);

      // Generate transaction ID (in real scenario, this comes from payment gateway)
      const transactionId = `TXN_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      // Complete payment
      const response = await paymentService.completePayment(
        payment.id,
        transactionId,
        true
      );

      if (response.status === 200) {
        handlePaymentCompleted(payment.id);
      } else {
        alert("Có lỗi xảy ra khi xác nhận thanh toán. Vui lòng thử lại.");
      }
    } catch (err) {
      console.error("Error completing payment:", err);
      alert("Có lỗi xảy ra khi xác nhận thanh toán. Vui lòng thử lại.");
    } finally {
      setProcessing(false);
    }
  };

  // Handle payment failure
  const handlePaymentFailure = () => {
    // Dừng polling
    if (pollingInterval) {
      clearInterval(pollingInterval);
      setPollingInterval(null);
    }
    setShowQRModal(false);
    navigate("/payment-failure");
  };

  // Cleanup polling khi component unmount
  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);

  // Handle back
  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="payment-wrapper">
        <Header />
        <main className="content" style={{ justifyContent: "center" }}>
          <div style={{ textAlign: "center", color: "#fff", padding: "40px" }}>
            <p>Đang tải thông tin thanh toán...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error && !booking) {
    return (
      <div className="payment-wrapper">
        <Header />
        <main className="content" style={{ justifyContent: "center" }}>
          <div style={{ textAlign: "center", color: "#e53e3e", padding: "40px" }}>
            <p>{error}</p>
            <button
              className="btn-pay"
              onClick={() => navigate("/")}
              style={{ marginTop: "20px" }}
            >
              Về trang chủ
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const total = booking?.totalPriceMovie || 0;

  // Loại bỏ duplicate ghế để hiển thị
  const uniqueSeatsForDisplay = selectedSeats
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

  return (
    <div className="payment-wrapper">
      <Header />

      <main className="content">
        {/* LEFT COLUMN */}
        <div className="left-column">
          <PaymentInfo
            booking={booking}
            movie={movie}
            showtime={showtime}
            selectedSeats={selectedSeats}
          />
        </div>

        {/* RIGHT COLUMN */}
        <div className="right-column">
          {/* Payment Methods Card */}
          <div className="info-card">
            <h3>Phương thức thanh toán</h3>
            <PaymentMethodSelector
              selected={selectedMethod}
              onSelect={setSelectedMethod}
            />
          </div>

          {/* Payment Summary Card */}
          <div className="info-card">
            <h3>Chi phí</h3>
            <div className="payment-summary">
              <div className="summary-section">
                <div className="payment-table">
                  <div className="table-row">
                    <span>Thanh toán</span>
                    <span>{total.toLocaleString("vi-VN")}₫</span>
                  </div>
                  <div className="table-row">
                    <span>Phí</span>
                    <span>0₫</span>
                  </div>
                  <div className="total-row">
                    <span>Tổng cộng</span>
                    <span>{total.toLocaleString("vi-VN")}₫</span>
                  </div>
                </div>
              </div>

              <button
                className="btn-pay"
                onClick={handlePayment}
                disabled={processing || !booking}
              >
                {processing ? "Đang xử lý..." : "Thanh toán"}
              </button>
              <button className="btn-back" onClick={handleBack}>
                Quay lại
              </button>

              <p className="note">
                <span className="note-label">Lưu ý:</span> Không mua vé cho trẻ
                em dưới 13 tuổi đối với các suất chiếu kết thúc sau 22h00 và
                không mua vé cho trẻ em dưới 16 tuổi đối với các suất chiếu phim
                kết thúc sau 23h00.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* QR Code Modal */}
      <QRCodeModal
        isOpen={showQRModal}
        onClose={() => {
          if (pollingInterval) {
            clearInterval(pollingInterval);
            setPollingInterval(null);
          }
          setShowQRModal(false);
        }}
        paymentMethod={selectedMethod}
        amount={total}
        movie={movie}
        showtime={showtime}
        selectedSeats={selectedSeats}
        paymentUrl={paymentUrl}
        qrCode={qrCode}
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentFailure={handlePaymentFailure}
      />

      <Footer />
    </div>
  );
}
