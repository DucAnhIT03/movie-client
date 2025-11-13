import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "../features/home/pages/Home.jsx";
import Calendar from "../features/showtime/pages/Calendar.jsx";
import Payment from "../features/payment/pages/Payment/Payment";
import PaymentSuccess from "../features/payment/pages/PaymentSuccess/PaymentSuccess";
import PaymentFailure from "../features/payment/pages/PaymentFailure/PaymentFailure";
import MovieInfo from "../features/Movie/components/MovieInfo.jsx";
import MovieDetail from "../features/Movie/pages/MovieDetail.jsx";
import TicketPrice from "../features/Ticket/pages/TicketPrice.jsx";
import ChooseSeat from "../features/Seat/pages/ChooseSeat.jsx";
import News from "../features/News/pages/News.jsx";
import NewsDetail from "../features/News/pages/NewsDetail.jsx";
import Festival from "../features/festival/pages/Festival.jsx";
import Promotions from "../features/promotions/page/Promotions.jsx";
import AdminLogin from "../features/admin/pages/Login/Login.jsx";
import AdminDashboard from "../features/admin/pages/Dashboard/Dashboard.jsx";
import AdminRegister from "../features/admin/pages/Register/Register.jsx";
import UserLogin from "../features/auth/pages/Login/Login.jsx";
import UserRegister from "../features/auth/pages/Register/Register.jsx";
import UserProfile from "../features/user/pages/Profile/Profile.jsx";
import FestivalDetail from "../features/festival/pages/FestivalDetail.jsx";

const AdminRoute = ({ children }) => {
  const isAdminAuth = localStorage.getItem("adminAuth") === "true";
  return isAdminAuth ? children : <Navigate to="/admin/login" />;
};

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-failure" element={<PaymentFailure />} />
        <Route path="/movie-info" element={<MovieInfo />} />
        <Route path="/ticket-price" element={<TicketPrice />} />
        <Route path="/choose-seat" element={<ChooseSeat />} />
        <Route path="/movie-detail" element={<MovieDetail />} />
        <Route path="/movie-detail/:id" element={<MovieDetail />} />
        <Route path="/news" element={<News />} />
        <Route path="/news-detail" element={<NewsDetail />} />
        <Route path="/news/:id" element={<NewsDetail />} />
        <Route path="/festival" element={<Festival />} />
        <Route path="/promotion" element={<Promotions />} />
        <Route path="/festival/:id" element={<FestivalDetail />} /> 

        {/* USER AUTH */}
        <Route path="/login" element={<UserLogin />} />
        <Route path="/register" element={<UserRegister />} />
        <Route path="/profile" element={<UserProfile />} />

        {/* ADMIN */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route path="/admin/*" element={<Navigate to="/admin/login" />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
