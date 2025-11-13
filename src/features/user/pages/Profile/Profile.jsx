import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateInfo } from "../../../../redux/counterSlice/userSlice";
import Header from "../../../../shared/layout/Header/Header.jsx";
import Footer from "../../../../shared/layout/Footer/Footer.jsx";
import userService from "../../../../services/user/userService";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";
import { FiEdit2, FiSave, FiX } from "react-icons/fi";
import ChangePassword from "../../components/ChangePassword/ChangePassword";
import "./Profile.css";

export default function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user?.user);
  const token = useSelector((state) => state.user?.token);

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    avatar: "",
  });
  const [avatarPreview, setAvatarPreview] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!token && !localStorage.getItem("accessToken")) {
      navigate("/login");
      return;
    }

    loadUserData();
  }, [token, navigate]);

  const loadUserData = async () => {
    setLoadingData(true);
    try {
      const res = await userService.getCurrentUser();
      if (res.status === 200) {
        const userInfo = res.data;
        // Load data từ API response
        const data = {
          firstName: userInfo.firstName ?? "",
          lastName: userInfo.lastName ?? "",
          email: userInfo.email ?? "",
          phone: userInfo.phone ?? "",
          address: userInfo.address ?? "",
          avatar: userInfo.avatar ?? "",
        };
        setUserData(data);
        setAvatarPreview(userInfo.avatar || "");
        
        // Cập nhật Redux store với data mới nhất từ API
        dispatch(updateInfo({
          token: token || localStorage.getItem("accessToken"),
          profile: userInfo
        }));
        localStorage.setItem("user", JSON.stringify(userInfo));
      } else if (res.status === 401) {
        alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        navigate("/login");
      } else {
        // Nếu API lỗi, thử load từ localStorage
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
          try {
            const parsed = JSON.parse(savedUser);
            setUserData({
              firstName: parsed.firstName ?? "",
              lastName: parsed.lastName ?? "",
              email: parsed.email ?? "",
              phone: parsed.phone ?? "",
              address: parsed.address ?? "",
              avatar: parsed.avatar ?? "",
            });
            setAvatarPreview(parsed.avatar || "");
          } catch (e) {
            console.error("Error parsing saved user:", e);
          }
        }
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      // Fallback: load từ localStorage
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          setUserData({
            firstName: parsed.firstName ?? "",
            lastName: parsed.lastName ?? "",
            email: parsed.email ?? "",
            phone: parsed.phone ?? "",
            address: parsed.address ?? "",
            avatar: parsed.avatar ?? "",
          });
          setAvatarPreview(parsed.avatar || "");
        } catch (e) {
          console.error("Error parsing saved user:", e);
        }
      }
    } finally {
      setLoadingData(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("Kích thước file không được vượt quá 10MB!");
        return;
      }
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await userService.updateProfile(userData, avatarFile);
      
      if (res.status === 200) {
        const updatedUser = res.data;
        // Cập nhật Redux store với data từ API
        dispatch(updateInfo({
          token: token || localStorage.getItem("accessToken"),
          profile: updatedUser
        }));
        localStorage.setItem("user", JSON.stringify(updatedUser));
        
        // Reload data từ API để đảm bảo hiển thị đúng
        await loadUserData();
        
        setIsEditing(false);
        setAvatarFile(null);
        alert("Cập nhật thông tin thành công!");
      } else if (res.status === 401) {
        alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        navigate("/login");
      } else {
        alert(res.data?.message || "Có lỗi xảy ra khi cập nhật thông tin!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Có lỗi xảy ra khi cập nhật thông tin!");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    loadUserData();
    setIsEditing(false);
    setAvatarFile(null);
    setAvatarPreview(userData.avatar || "");
  };

  const getUserDisplayName = () => {
    if (userData.firstName && userData.lastName) {
      return `${userData.firstName} ${userData.lastName}`;
    }
    return userData.firstName || userData.email || "User";
  };

  const getInitials = () => {
    const first = userData.firstName?.charAt(0) || userData.email?.charAt(0) || "U";
    const last = userData.lastName?.charAt(0) || "";
    return (first + last).toUpperCase();
  };

  if (loadingData) {
    return (
      <div className="profile-page">
        <Header />
        <div className="profile-container">
          <div style={{ textAlign: "center", padding: "100px 20px" }}>
            <p>Đang tải thông tin...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="profile-page">
      <Header />
      <div className="profile-container">
        <div className="profile-header">
          <h1>Quản lý tài khoản</h1>
          <p>Quản lý thông tin cá nhân và cài đặt tài khoản của bạn</p>
        </div>

        <div className="profile-content">
          {/* Avatar Section */}
          <div className="profile-avatar-section">
            <div className="avatar-container">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" className="avatar-image" />
              ) : (
                <div className="avatar-placeholder">
                  {getInitials()}
                </div>
              )}
              {isEditing && (
                <label className="avatar-upload-btn">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    style={{ display: "none" }}
                  />
                  <FiEdit2 size={20} />
                </label>
              )}
            </div>
            <h2>{getUserDisplayName()}</h2>
            <div className="user-email">
              {userData.email || "Chưa có email"}
            </div>
            {!isEditing && (
              <button className="edit-btn" onClick={() => setIsEditing(true)}>
                <FiEdit2 size={18} />
                Chỉnh sửa thông tin
              </button>
            )}
          </div>

          {/* Profile Form */}
          <div className="profile-form-section">
            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
              <div className="form-group">
                <label>Họ</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="firstName"
                    value={userData.firstName}
                    onChange={handleInputChange}
                    placeholder="Nhập họ"
                  />
                ) : (
                  <div className="form-value">{userData.firstName || "Chưa cập nhật"}</div>
                )}
              </div>

              <div className="form-group">
                <label>Tên</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="lastName"
                    value={userData.lastName}
                    onChange={handleInputChange}
                    placeholder="Nhập tên"
                  />
                ) : (
                  <div className="form-value">{userData.lastName || "Chưa cập nhật"}</div>
                )}
              </div>

              <div className="form-group">
                <label>
                  <MdEmail size={20} />
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={userData.email}
                    onChange={handleInputChange}
                    placeholder="Nhập email"
                    required
                  />
                ) : (
                  <div className="form-value">{userData.email || "Chưa cập nhật"}</div>
                )}
              </div>

              <div className="form-group">
                <label>
                  <MdPhone size={20} />
                  Số điện thoại
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={userData.phone}
                    onChange={handleInputChange}
                    placeholder="Nhập số điện thoại"
                  />
                ) : (
                  <div className="form-value">{userData.phone || "Chưa cập nhật"}</div>
                )}
              </div>

              <div className="form-group">
                <label>
                  <MdLocationOn size={20} />
                  Địa chỉ
                </label>
                {isEditing ? (
                  <textarea
                    name="address"
                    value={userData.address}
                    onChange={handleInputChange}
                    placeholder="Nhập địa chỉ"
                    rows={3}
                  />
                ) : (
                  <div className="form-value">{userData.address || "Chưa cập nhật"}</div>
                )}
              </div>

              {isEditing && (
                <div className="form-actions">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    <FiX size={18} />
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="save-btn"
                    disabled={loading}
                  >
                    <FiSave size={18} />
                    {loading ? "Đang lưu..." : "Lưu thay đổi"}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Change Password Section */}
        <ChangePassword />
      </div>
      <Footer />
    </div>
  );
}

