import { useState } from "react";
import { FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import userService from "../../../../services/user/userService";
import "./ChangePassword.css";

export default function ChangePassword() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError("");
    if (success) setSuccess("");
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const validateForm = () => {
    if (!formData.currentPassword) {
      setError("Vui lòng nhập mật khẩu hiện tại");
      return false;
    }
    if (!formData.newPassword) {
      setError("Vui lòng nhập mật khẩu mới");
      return false;
    }
    if (formData.newPassword.length < 8) {
      setError("Mật khẩu mới phải có ít nhất 8 ký tự");
      return false;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return false;
    }
    if (formData.currentPassword === formData.newPassword) {
      setError("Mật khẩu mới phải khác với mật khẩu hiện tại");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await userService.changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      if (response.status === 200) {
        setSuccess("Đổi mật khẩu thành công!");
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        // Clear success message after 5 seconds
        setTimeout(() => setSuccess(""), 5000);
      } else if (response.status === 400) {
        setError(
          response.data?.message || "Mật khẩu hiện tại không đúng hoặc mật khẩu mới không hợp lệ"
        );
      } else if (response.status === 401) {
        setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else {
        setError("Có lỗi xảy ra. Vui lòng thử lại sau.");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      setError("Có lỗi xảy ra. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-password-section">
      <div className="change-password-header">
        <h3>
          <FiLock size={24} />
          Đổi mật khẩu
        </h3>
        <p>Thay đổi mật khẩu tài khoản của bạn</p>
      </div>

      <form onSubmit={handleSubmit} className="change-password-form">
        {error && (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            <span>{success}</span>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="currentPassword">
            <FiLock size={18} />
            Mật khẩu hiện tại
          </label>
          <div className="password-input-wrapper">
            <input
              type={showPasswords.current ? "text" : "password"}
              id="currentPassword"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleInputChange}
              placeholder="Nhập mật khẩu hiện tại"
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => togglePasswordVisibility("current")}
            >
              {showPasswords.current ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="newPassword">
            <FiLock size={18} />
            Mật khẩu mới
          </label>
          <div className="password-input-wrapper">
            <input
              type={showPasswords.new ? "text" : "password"}
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              placeholder="Nhập mật khẩu mới (tối thiểu 8 ký tự)"
              required
              minLength={8}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => togglePasswordVisibility("new")}
            >
              {showPasswords.new ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">
            <FiLock size={18} />
            Xác nhận mật khẩu mới
          </label>
          <div className="password-input-wrapper">
            <input
              type={showPasswords.confirm ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Nhập lại mật khẩu mới"
              required
              minLength={8}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => togglePasswordVisibility("confirm")}
            >
              {showPasswords.confirm ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
          </button>
        </div>
      </form>
    </div>
  );
}

