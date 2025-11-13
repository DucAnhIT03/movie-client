import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdEmail } from "react-icons/md";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FaApple } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import authService from "../../../../services/auth/authService";

import "./Register.css";

export default function Register() {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // OTP verification state
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const [registrationData, setRegistrationData] = useState(null);

  const redirectTo = () => navigate("/login");

  // Countdown timer
  useEffect(() => {
    let timer;
    if (showOtpForm && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [showOtpForm, countdown]);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!email.includes("@")) {
      alert("Vui lòng nhập email hợp lệ!");
      return;
    }

    if (password.length < 6) {
      alert("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }

    if (!firstName.trim()) {
      alert("Vui lòng nhập họ!");
      return;
    }

    // Validate phone number if provided
    const trimmedPhone = phone.trim();
    if (trimmedPhone) {
      // Vietnam phone number validation: start with 0 or +84, followed by valid operator (3,5,7,8,9) and 8 digits
      const phoneRegex = /^(\+84|0)(3|5|7|8|9)\d{8}$/;
      if (!phoneRegex.test(trimmedPhone)) {
        alert("Số điện thoại không hợp lệ! Vui lòng nhập số điện thoại Việt Nam hợp lệ (bắt đầu bằng 0 hoặc +84).");
        return;
      }
    }

    const payload = {
      firstName: firstName.trim(),
      lastName: lastName.trim() || undefined,
      email: email.trim(),
      password,
    };

    // Only include phone if it has a valid value
    if (trimmedPhone) {
      payload.phone = trimmedPhone;
    }

    // Save registration data for later use
    setRegistrationData(payload);

    // Send OTP to email
    const otpRes = await authService.sendVerificationOtp(email.trim());

    if (otpRes.status !== 200 && otpRes.status !== 201) {
      alert(otpRes.data?.message || "Không thể gửi mã xác thực. Vui lòng thử lại sau!");
      return;
    }

    // Show OTP form
    setShowOtpForm(true);
    setCountdown(60);
    alert("Mã xác thực đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư!");
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      alert("Vui lòng nhập mã xác thực 6 chữ số!");
      return;
    }

    if (countdown <= 0) {
      alert("Mã xác thực đã hết hạn! Vui lòng gửi lại mã mới.");
      return;
    }

    const verifyPayload = {
      ...registrationData,
      otp: otp.trim(),
    };

    const res = await authService.verifyOtpAndRegister(verifyPayload);

    if (res.status === 400) {
      alert(res.data?.message || "Mã xác thực không đúng hoặc đã hết hạn!");
      return;
    }

    if (res.status !== 201) {
      alert("Có lỗi xảy ra, vui lòng thử lại sau!");
      return;
    }

    alert("Đăng ký thành công! Vui lòng đăng nhập.");
    navigate("/login");
  };

  const handleResendOtp = async () => {
    if (isResending || countdown > 0) return;

    setIsResending(true);
    const otpRes = await authService.sendVerificationOtp(email.trim());

    if (otpRes.status === 200 || otpRes.status === 201) {
      setCountdown(60);
      setOtp("");
      alert("Mã xác thực mới đã được gửi đến email của bạn!");
    } else {
      alert(otpRes.data?.message || "Không thể gửi lại mã xác thực. Vui lòng thử lại sau!");
    }
    setIsResending(false);
  };

  return (
    <div className="loginBackground" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div className="loginForm">
        <div className="credentialForm">

          <div className="loginHeader">
            <div className="logo">
              <img src="/logo.png" alt="" />
            </div>

            <div className="Welcome">
              <h3>Kính Chào Quý Khách!</h3>
              <p>Chúng tôi rất vui được phục vụ quý khách!</p>
            </div>
          </div>

          <div className="switchMode">
            <button onClick={redirectTo} className="signIn">
              Đăng nhập
            </button>
            <button className="signUp active">
              Đăng ký
            </button>
          </div>

          {!showOtpForm ? (
            <form onSubmit={handleRegister}>
              {/* First Name */}
              <div className="credInput">
                <input
                  type="text"
                  required
                  placeholder="Nhập họ"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>

              {/* Last Name */}
              <div className="credInput">
                <input
                  type="text"
                  placeholder="Nhập tên (tùy chọn)"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>

              {/* Email */}
              <div className="credInput">
                <input
                  type="email"
                  required
                  placeholder="Nhập email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <MdEmail size={22} style={{ color: "gray" }} />
              </div>

              {/* Phone */}
              <div className="credInput">
                <input
                  type="tel"
                  placeholder="Nhập số điện thoại (tùy chọn)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              {/* Password */}
              <div className="credInput">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <div className="eyeIcon" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <FiEye size={22} />
                  ) : (
                    <FiEyeOff size={22} />
                  )}
                </div>
              </div>

              <button className="mainLogin" type="submit">Gửi mã xác thực</button>

              <div className="Line">
                <span>OR</span>
              </div>

              <div className="accountLink">
                <div className="apple">
                  <FaApple size={20} />
                  <p>Đăng nhập với Apple</p>
                </div>

                <div className="google">
                  <FcGoogle size={22} />
                  <p>Đăng nhập với Google</p>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp}>
              <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <p style={{ color: "#666", marginBottom: "10px" }}>
                  Mã xác thực đã được gửi đến email: <strong>{email}</strong>
                </p>
                <p style={{ color: countdown > 0 ? "#2d4ef5" : "#ff4444", fontSize: "14px", fontWeight: "600" }}>
                  {countdown > 0 ? `Mã còn hiệu lực trong: ${countdown}s` : "Mã đã hết hạn"}
                </p>
              </div>

              {/* OTP Input */}
              <div className="credInput">
                <input
                  type="text"
                  required
                  placeholder="Nhập mã xác thực 6 chữ số"
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                    setOtp(value);
                  }}
                  maxLength={6}
                  style={{ textAlign: "center", letterSpacing: "8px", fontSize: "20px", fontWeight: "bold" }}
                />
              </div>

              <button 
                className="mainLogin" 
                type="submit"
                disabled={countdown <= 0 || !otp || otp.length !== 6}
                style={{ 
                  opacity: (countdown <= 0 || !otp || otp.length !== 6) ? 0.5 : 1,
                  cursor: (countdown <= 0 || !otp || otp.length !== 6) ? "not-allowed" : "pointer"
                }}
              >
                Xác thực và Đăng ký
              </button>

              <div style={{ textAlign: "center", marginTop: "15px" }}>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={countdown > 0 || isResending}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: countdown > 0 ? "#999" : "#2d4ef5",
                    cursor: countdown > 0 ? "not-allowed" : "pointer",
                    textDecoration: countdown > 0 ? "none" : "underline",
                    fontSize: "14px",
                  }}
                >
                  {isResending ? "Đang gửi..." : countdown > 0 ? `Gửi lại mã sau ${countdown}s` : "Gửi lại mã xác thực"}
                </button>
              </div>

              <div style={{ textAlign: "center", marginTop: "15px" }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowOtpForm(false);
                    setOtp("");
                    setCountdown(60);
                  }}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#666",
                    cursor: "pointer",
                    fontSize: "14px",
                    textDecoration: "underline",
                  }}
                >
                  Quay lại
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="decoration">
          <div className="copyright">
            <p>&copy; 2025 Gradiator Inc. All rights reserved.</p>
            <p>&copy;copy right by Vhiepp.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

