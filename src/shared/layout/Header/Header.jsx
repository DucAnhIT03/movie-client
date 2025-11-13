import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../../redux/counterSlice/userSlice";
import "./Header.css";

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const user = useSelector((state) => state.user?.user);
  const token = useSelector((state) => state.user?.token);

  // Load user info from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("accessToken");
    if (savedUser && savedToken && !user) {
      // User info will be loaded by Redux if needed
    }
  }, [user]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  const isLoggedIn = !!(user || localStorage.getItem("user"));

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
    setShowUserMenu(false);
    alert("Đăng xuất thành công!");
  };

  const getUserDisplayName = () => {
    if (!user) {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        return parsed.firstName || parsed.email || "User";
      }
      return "User";
    }
    return user.firstName || user.email || "User";
  };

  return (
    <div className="header">
      <div className="menu">
        <div className="logo-group">
          <img src="/src/assets/logo.png" alt="logo" />
          <div className="cinema-text">
            <p className="vn">TRUNG TÂM CHIẾU PHIM QUỐC GIA</p>
            <p className="en">National Cinema Center</p>
          </div>
        </div>
        <nav className={`nav ${isOpen ? "open" : ""}`}>
          <Link to="/" onClick={() => setIsOpen(false)}>
            Trang chủ
          </Link>
          <Link to="/calendar" onClick={() => setIsOpen(false)}>
            Lịch chiếu
          </Link>
          <Link to="/news" onClick={() => setIsOpen(false)}>
            Tin tức
          </Link>
          <Link to="/promotion" onClick={() => setIsOpen(false)}>
            Khuyến mãi
          </Link>
          <Link to="/ticket-price" onClick={() => setIsOpen(false)}>
            Giá vé
          </Link>
          <Link to="/festival" onClick={() => setIsOpen(false)}>
            Liên hoan phim
          </Link>
        </nav>
      </div>

      {isLoggedIn ? (
        <div className="user-menu-container" style={{ position: "relative" }}>
          <div 
            className="user-info" 
            onClick={() => setShowUserMenu(!showUserMenu)}
            style={{ 
              cursor: "pointer", 
              display: "flex",
              alignItems: "center",
              padding: "8px 12px",
              borderRadius: "8px",
              transition: "background-color 0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
          >
            <div className="user-avatar" style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "#2d4ef5",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              fontSize: "16px",
              marginRight: "10px"
            }}>
              {getUserDisplayName().charAt(0).toUpperCase()}
            </div>
            <span style={{ color: "#fff", fontWeight: "500" }}>
              {getUserDisplayName()}
            </span>
          </div>
          {showUserMenu && (
            <>
              <div 
                className="overlay-menu" 
                onClick={() => setShowUserMenu(false)}
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 999
                }}
              />
              <div className="user-dropdown" style={{
                position: "absolute",
                top: "100%",
                right: "0",
                marginTop: "10px",
                backgroundColor: "white",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                minWidth: "200px",
                zIndex: 1000,
                padding: "10px 0"
              }}>
              <div style={{ padding: "10px 20px", borderBottom: "1px solid #eee" }}>
                <div style={{ fontWeight: "600", color: "#333" }}>{getUserDisplayName()}</div>
                <div style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
                  {user?.email || JSON.parse(localStorage.getItem("user") || "{}").email}
                </div>
              </div>
              <button
                onClick={() => {
                  navigate("/profile");
                  setShowUserMenu(false);
                }}
                style={{
                  width: "100%",
                  padding: "10px 20px",
                  border: "none",
                  background: "transparent",
                  textAlign: "left",
                  cursor: "pointer",
                  color: "#333",
                  fontWeight: "500"
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = "#f5f5f5"}
                onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
              >
                Quản lý tài khoản
              </button>
              <button
                onClick={handleLogout}
                style={{
                  width: "100%",
                  padding: "10px 20px",
                  border: "none",
                  background: "transparent",
                  textAlign: "left",
                  cursor: "pointer",
                  color: "#ff4444",
                  fontWeight: "500",
                  borderTop: "1px solid #eee"
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = "#f5f5f5"}
                onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
              >
                Đăng xuất
              </button>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="btn">
          <button
            className="register"
            onClick={() => navigate("/register")}
          >
            Đăng ký
          </button>
          <button className="login" onClick={() => navigate("/login")}>
            Đăng nhập
          </button>
        </div>
      )}

      {/* ICON 3 GẠCH */}
      <div
        className={`hamburger ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Lớp nền mờ khi mở sidebar */}
      {isOpen && (
        <div className="overlay" onClick={() => setIsOpen(false)}></div>
      )}
    </div>
  );
}
