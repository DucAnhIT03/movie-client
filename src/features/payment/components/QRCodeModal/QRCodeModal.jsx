import React, { useEffect } from "react";
import { IoClose } from "react-icons/io5";
import "./QRCodeModal.css";

const methodNames = {
  VIETQR: "VietQR",
  VNPAY: "VNPAY",
  VIETTEL_PAY: "Viettel Money",
  PAYPAL: "Payoo",
};

const methodImages = {
  VIETQR: "/vietqr.png",
  VNPAY: "/vnpay.png",
  VIETTEL_PAY: "/viettelmoney.png",
  PAYPAL: "/payoo.png",
};

export default function QRCodeModal({
  isOpen,
  onClose,
  paymentMethod,
  amount,
  movie,
  showtime,
  selectedSeats,
  paymentUrl,
  qrCode,
  onPaymentSuccess,
  onPaymentFailure,
}) {
  useEffect(() => {
    // Nếu có payment URL và là VNPAY, tự động redirect
    if (paymentUrl && paymentMethod === "VNPAY" && isOpen) {
      window.open(paymentUrl, "_blank");
    }
  }, [paymentUrl, paymentMethod, isOpen]);

  if (!isOpen) return null;

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

  const seatNumbers = selectedSeats
    ? selectedSeats.map((s) => s.seatNumber || s.seatCode).join(", ")
    : "";

  const handleOpenPaymentUrl = () => {
    if (paymentUrl) {
      window.open(paymentUrl, "_blank");
    }
  };

  return (
    <div className="qr-modal-overlay" onClick={onClose}>
      <div className="qr-modal" onClick={(e) => e.stopPropagation()}>
        <div className="qr-modal-header">
          <h3>
            {paymentMethod === "VNPAY"
              ? "Thanh toán qua VNPAY"
              : "Quét mã QR để thanh toán"}
          </h3>
          <button className="close-btn" onClick={onClose}>
            <IoClose />
          </button>
        </div>

        <div className="qr-modal-content">
          <div className="payment-info">
            <div className="selected-method">
              <img
                src={methodImages[paymentMethod] || "/vietqr.png"}
                alt={methodNames[paymentMethod] || "Payment"}
              />
              <span>{methodNames[paymentMethod] || "Payment"}</span>
            </div>
            <div className="amount-info">
              <span className="amount-label">Số tiền:</span>
              <span className="amount-value">
                {amount.toLocaleString("vi-VN")}₫
              </span>
            </div>
          </div>

          {paymentMethod === "VNPAY" && paymentUrl ? (
            <div className="payment-url-container">
              <p className="payment-url-instruction">
                Nhấn vào nút bên dưới để mở trang thanh toán VNPAY
              </p>
              <button className="btn-open-payment" onClick={handleOpenPaymentUrl}>
                Thanh toán qua VNPAY
              </button>
              <p className="payment-url-note">
                Trang thanh toán sẽ mở trong tab mới. Sau khi thanh toán thành công,
                bạn sẽ được chuyển về trang này tự động.
              </p>
            </div>
          ) : (
            <div className="qr-code-container">
              <div className="qr-code">
                <img
                  src={qrCode || "/maqrthanhtoan.png"}
                  alt="Mã QR thanh toán"
                  className="qr-image"
                  onError={(e) => {
                    e.target.src = "/maqrthanhtoan.png";
                  }}
                />
              </div>
              <p className="qr-instruction">
                Mở ứng dụng {methodNames[paymentMethod] || "thanh toán"} và quét
                mã QR để thanh toán
              </p>
            </div>
          )}

          {movie && showtime && (
            <div className="payment-details">
              <div className="detail-row">
                <span>Phim:</span>
                <span>
                  {movie.title || "N/A"}
                  {movie.ageRating && ` - ${movie.ageRating}`}
                </span>
              </div>
              <div className="detail-row">
                <span>Ghế:</span>
                <span>{seatNumbers || "N/A"}</span>
              </div>
              <div className="detail-row">
                <span>Thời gian:</span>
                <span>
                  {formatTime(showtime.startTime)} -{" "}
                  {formatDate(showtime.startTime)}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="qr-modal-footer">
          <button className="btn-cancel" onClick={onPaymentFailure}>
            Hủy thanh toán
          </button>
          {paymentMethod !== "VNPAY" && (
            <button className="btn-confirm" onClick={onPaymentSuccess}>
              Đã thanh toán
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
