import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import StatCard from "../../components/StatCard/StatCard";
import RevenueChart from "../../components/RevenueChart/RevenueChart";
import TopList from "../../components/TopList/TopList";
import dashboardService from "../../../../services/dashboard/dashboardService";
import {
  FaUsers,
  FaTheaterMasks,
  FaFilm,
  FaTicketAlt,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaEnvelope,
  FaTasks,
} from "react-icons/fa";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Kiểm tra token trước khi gọi API
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("No access token found");
      setError("Vui lòng đăng nhập lại");
      navigate("/admin/login");
      return;
    }
    
    console.log("Token found, loading dashboard stats...");
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Loading dashboard stats...");
      const response = await dashboardService.getStats();
      console.log("Dashboard API Response:", response);

      if (response.status === 200 && response.data) {
        console.log("Dashboard data:", response.data);
        console.log("Totals:", response.data.totals);
        console.log("Users:", response.data.totals?.users, "Type:", typeof response.data.totals?.users);
        console.log("Active Users:", response.data.totals?.activeUsers, "Type:", typeof response.data.totals?.activeUsers);
        
        // Đảm bảo các giá trị số được parse đúng
        const processedData = {
          ...response.data,
          totals: {
            ...response.data.totals,
            users: Number(response.data.totals?.users) || 0,
            activeUsers: Number(response.data.totals?.activeUsers) || 0,
            theaters: Number(response.data.totals?.theaters) || 0,
            screens: Number(response.data.totals?.screens) || 0,
            movies: Number(response.data.totals?.movies) || 0,
            showtimesUpcoming: Number(response.data.totals?.showtimesUpcoming) || 0,
          },
          bookings: {
            ...response.data.bookings,
            total: Number(response.data.bookings?.total) || 0,
            today: Number(response.data.bookings?.today) || 0,
            thisWeek: Number(response.data.bookings?.thisWeek) || 0,
            thisMonth: Number(response.data.bookings?.thisMonth) || 0,
          },
        };
        
        console.log("Processed data - Users:", processedData.totals.users);
        setStats(processedData);
      } else if (response.status === 401) {
        console.error("Unauthorized - redirecting to login");
        alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        navigate("/admin/login");
      } else {
        console.error("Failed to load dashboard:", response.status, response.data);
        setError(`Không thể tải dữ liệu dashboard. Status: ${response.status}`);
      }
    } catch (err) {
      console.error("Error loading dashboard stats:", err);
      console.error("Error details:", err.response?.data || err.message);
      setError(`Có lỗi xảy ra khi tải dữ liệu: ${err.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("adminAuth");
    navigate("/admin/login");
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <nav className="admin-nav">
          <h2>Admin Dashboard</h2>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </nav>
        <div className="admin-content">
          <div className="loading-container">
            <p>Đang tải dữ liệu...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="admin-dashboard">
        <nav className="admin-nav">
          <h2>Admin Dashboard</h2>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </nav>
        <div className="admin-content">
          <div className="error-container">
            <p>{error || "Không thể tải dữ liệu"}</p>
            <button onClick={loadDashboardStats} className="retry-btn">
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <nav className="admin-nav">
        <h2>Admin Dashboard</h2>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </nav>

      <div className="admin-content">
        {/* Tổng quan */}
        <section className="dashboard-section">
          <h2 className="section-title">Tổng quan</h2>
          <div className="dashboard-stats">
            <StatCard
              title="Người dùng"
              value={Number(stats.totals?.users) || 0}
              icon={<FaUsers />}
              color="#1e3c72"
            />
            <StatCard
              title="Người dùng hoạt động"
              value={Number(stats.totals?.activeUsers) || 0}
              icon={<FaUsers />}
              color="#2a5298"
            />
            <StatCard
              title="Số rạp"
              value={Number(stats.totals?.theaters) || 0}
              icon={<FaTheaterMasks />}
              color="#667eea"
            />
            <StatCard
              title="Phim đang chiếu"
              value={Number(stats.totals?.movies) || 0}
              icon={<FaFilm />}
              color="#f093fb"
            />
            <StatCard
              title="Vé đã đặt"
              value={Number(stats.bookings?.total) || 0}
              icon={<FaTicketAlt />}
              color="#11998e"
            />
            <StatCard
              title="Doanh thu"
              value={formatCurrency(stats.revenue?.total || 0)}
              icon={<FaMoneyBillWave />}
              color="#f12711"
            />
          </div>
        </section>

        {/* Đặt vé */}
        <section className="dashboard-section">
          <h2 className="section-title">Đặt vé</h2>
          <div className="dashboard-stats">
            <StatCard
              title="Tổng đặt vé"
              value={stats.bookings?.total || 0}
              icon={<FaTicketAlt />}
              color="#11998e"
            />
            <StatCard
              title="Hôm nay"
              value={stats.bookings?.today || 0}
              icon={<FaTicketAlt />}
              color="#38ef7d"
            />
            <StatCard
              title="Tuần này"
              value={stats.bookings?.thisWeek || 0}
              icon={<FaTicketAlt />}
              color="#06beb6"
            />
            <StatCard
              title="Tháng này"
              value={stats.bookings?.thisMonth || 0}
              icon={<FaTicketAlt />}
              color="#48b1bf"
            />
          </div>
        </section>

        {/* Doanh thu */}
        <section className="dashboard-section">
          <h2 className="section-title">Doanh thu</h2>
          <div className="dashboard-stats">
            <StatCard
              title="Tổng doanh thu"
              value={formatCurrency(stats.revenue?.total || 0)}
              icon={<FaMoneyBillWave />}
              color="#f12711"
            />
            <StatCard
              title="Hôm nay"
              value={formatCurrency(stats.revenue?.today || 0)}
              icon={<FaMoneyBillWave />}
              color="#f5af19"
            />
            <StatCard
              title="Tuần này"
              value={formatCurrency(stats.revenue?.thisWeek || 0)}
              icon={<FaMoneyBillWave />}
              color="#f093fb"
            />
            <StatCard
              title="Tháng này"
              value={formatCurrency(stats.revenue?.thisMonth || 0)}
              icon={<FaMoneyBillWave />}
              color="#4facfe"
            />
          </div>
        </section>

        {/* Vé đã bán */}
        <section className="dashboard-section">
          <h2 className="section-title">Vé đã bán</h2>
          <div className="dashboard-stats">
            <StatCard
              title="Hôm nay"
              value={stats.tickets?.soldToday || 0}
              icon={<FaTicketAlt />}
              color="#11998e"
            />
            <StatCard
              title="Tháng này"
              value={stats.tickets?.soldThisMonth || 0}
              icon={<FaTicketAlt />}
              color="#38ef7d"
            />
          </div>
        </section>

        {/* Biểu đồ */}
        <section className="dashboard-section">
          <h2 className="section-title">Biểu đồ</h2>
          <div className="charts-grid">
            {stats.charts?.revenueDaily && stats.charts.revenueDaily.length > 0 && (
              <RevenueChart
                title="Doanh thu theo ngày (30 ngày gần nhất)"
                data={stats.charts.revenueDaily}
                type="daily"
              />
            )}
            {stats.charts?.revenueMonthly && stats.charts.revenueMonthly.length > 0 && (
              <RevenueChart
                title="Doanh thu theo tháng (12 tháng gần nhất)"
                data={stats.charts.revenueMonthly}
                type="monthly"
              />
            )}
            {stats.charts?.ticketsDaily && stats.charts.ticketsDaily.length > 0 && (
              <RevenueChart
                title="Vé bán theo ngày (30 ngày gần nhất)"
                data={stats.charts.ticketsDaily}
                type="daily"
              />
            )}
          </div>
        </section>

        {/* Top và Thống kê khác */}
        <section className="dashboard-section">
          <h2 className="section-title">Top doanh thu</h2>
          <div className="top-grid">
            <TopList
              title="Top 5 phim doanh thu cao nhất"
              items={stats.top?.topMoviesByRevenue || []}
              type="movies"
            />
            <TopList
              title="Top 5 rạp doanh thu cao nhất"
              items={stats.top?.topTheatersByRevenue || []}
              type="theaters"
            />
          </div>
        </section>

        {/* Thống kê thanh toán và hệ thống */}
        <section className="dashboard-section">
          <h2 className="section-title">Hệ thống</h2>
          <div className="dashboard-stats">
            {stats.revenueByPaymentMethod && stats.revenueByPaymentMethod.length > 0 && (
              <div className="payment-methods-card">
                <h3>Doanh thu theo phương thức thanh toán</h3>
                <div className="payment-methods-list">
                  {stats.revenueByPaymentMethod.map((item, index) => (
                    <div key={index} className="payment-method-item">
                      <span className="method-name">{item.method}</span>
                      <span className="method-amount">
                        {formatCurrency(item.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {stats.emails && (
              <div className="system-stats-card">
                <h3>
                  <FaEnvelope /> Email
                </h3>
                <div className="system-stats">
                  <div className="system-stat">
                    <span>Tổng: {stats.emails.total || 0}</span>
                  </div>
                  <div className="system-stat">
                    <span>Đã gửi: {stats.emails.sent || 0}</span>
                  </div>
                  <div className="system-stat">
                    <span>Thất bại: {stats.emails.failed || 0}</span>
                  </div>
                  <div className="system-stat">
                    <span>Đang chờ: {stats.emails.pending || 0}</span>
                  </div>
                </div>
              </div>
            )}

            {stats.queue && (
              <div className="system-stats-card">
                <h3>
                  <FaTasks /> Queue
                </h3>
                <div className="system-stats">
                  <div className="system-stat">
                    <span>Đang chờ: {stats.queue.waiting || 0}</span>
                  </div>
                  <div className="system-stat">
                    <span>Đang xử lý: {stats.queue.active || 0}</span>
                  </div>
                  <div className="system-stat">
                    <span>Hoàn thành: {stats.queue.completed || 0}</span>
                  </div>
                  <div className="system-stat">
                    <span>Thất bại: {stats.queue.failed || 0}</span>
                  </div>
                  {stats.queue.error && (
                    <div className="system-error">
                      Lỗi: {stats.queue.error}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
