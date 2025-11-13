import { useState, useEffect } from "react";
import showtimeService from "../../../../services/showtime/showtimeService";
import "./ShowtimeSelector.css";

// Format date từ Date object sang DD-MM-YYYY
function formatDateForDisplay(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

// Format date từ DD-MM-YYYY sang YYYY-MM-DD cho API
function formatDateForAPI(dateStr) {
  const [day, month, year] = dateStr.split("-");
  return `${year}-${month}-${day}`;
}

// Format thời gian từ Date object
function formatTime(dateStr) {
  const date = new Date(dateStr);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

// Format ngày tháng để hiển thị
function formatDateLabel(dateStr) {
  const [day, month, year] = dateStr.split("-");
  const date = new Date(`${year}-${month}-${day}`);
  const days = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"];
  const months = ["Th. 1", "Th. 2", "Th. 3", "Th. 4", "Th. 5", "Th. 6", "Th. 7", "Th. 8", "Th. 9", "Th. 10", "Th. 11", "Th. 12"];
  
  return {
    day: days[date.getDay()],
    date: day,
    month: months[parseInt(month) - 1],
  };
}

export default function ShowtimeSelector({ 
  movieId, 
  onSelectShowtime,
  selectedDate: externalSelectedDate,
  hideDateSelector = false 
}) {
  const [showtimes, setShowtimes] = useState({}); // { date: { screenId: [showtimes] } }
  const [loading, setLoading] = useState(true);
  const [internalSelectedDate, setInternalSelectedDate] = useState(() => {
    const today = new Date();
    return formatDateForDisplay(today);
  });
  
  // Sử dụng external date nếu có, nếu không dùng internal
  const selectedDate = externalSelectedDate || internalSelectedDate;
  const setSelectedDate = externalSelectedDate ? () => {} : setInternalSelectedDate;

  // Tạo danh sách 7 ngày từ hôm nay
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return formatDateForDisplay(date);
  });

  // Load showtimes khi chọn ngày hoặc movieId thay đổi
  useEffect(() => {
    const loadShowtimes = async () => {
      if (!movieId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const apiDate = formatDateForAPI(selectedDate);
        const showtimesByDate = {};

        // Lấy showtimes cho phim
        const response = await showtimeService.getShowtimesByMovie(movieId);

        if (response.status === 200 && response.data) {
          // Response có thể là array hoặc object với items
          const showtimesList = Array.isArray(response.data)
            ? response.data
            : response.data.items || [];

          // Nhóm showtimes theo ngày và screen
          showtimesList.forEach((st) => {
            const showtimeDate = new Date(st.startTime);
            const dateKey = formatDateForDisplay(showtimeDate);

            if (!showtimesByDate[dateKey]) {
              showtimesByDate[dateKey] = {};
            }

            const screenId = st.screen?.id || st.screenId;
            if (!showtimesByDate[dateKey][screenId]) {
              showtimesByDate[dateKey][screenId] = {
                screen: st.screen,
                showtimes: [],
              };
            }

            showtimesByDate[dateKey][screenId].showtimes.push(st);
          });

          // Sắp xếp showtimes theo thời gian
          Object.keys(showtimesByDate).forEach((dateKey) => {
            Object.keys(showtimesByDate[dateKey]).forEach((screenId) => {
              showtimesByDate[dateKey][screenId].showtimes.sort(
                (a, b) => new Date(a.startTime) - new Date(b.startTime)
              );
            });
          });

          setShowtimes(showtimesByDate);
        }
      } catch (error) {
        console.error("Error loading showtimes:", error);
      } finally {
        setLoading(false);
      }
    };

    loadShowtimes();
  }, [selectedDate, movieId]);

  // Xử lý chọn showtime
  const handleSelectShowtime = (showtime) => {
    if (onSelectShowtime) {
      onSelectShowtime(showtime);
    } else {
      // Default behavior: lưu vào localStorage và navigate
      localStorage.setItem("selectedShowtimeId", showtime.id);
      localStorage.setItem("selectedTime", formatTime(showtime.startTime));
      localStorage.setItem("selectedMovieId", showtime.movieId);
      localStorage.setItem("selectedScreenId", showtime.screenId || showtime.screen?.id);
    }
  };

  const currentDateShowtimes = showtimes[selectedDate] || {};
  const hasShowtimes = Object.keys(currentDateShowtimes).length > 0;

  return (
    <div className="showtime-selector">
      {!hideDateSelector && (
        <div className="dates">
          {dates.map((date) => {
            const label = formatDateLabel(date);
            const isActive = selectedDate === date;
            const hasShowtimesForDate = showtimes[date] && Object.keys(showtimes[date]).length > 0;

            return (
              <div
                key={date}
                className={`date ${isActive ? "active" : ""} ${hasShowtimesForDate ? "has-showtimes" : ""}`}
                onClick={() => setSelectedDate(date)}
              >
                <p className="month">{label.month}</p>
                <h3>{label.date}</h3>
                <p className="day">{label.day}</p>
              </div>
            );
          })}
        </div>
      )}

      {!hideDateSelector && (
        <p className="note">
          <strong>Lưu ý:</strong> Khán giả dưới 13 tuổi chỉ chọn suất chiếu kết
          thúc trước 22h và khán giả dưới 16 tuổi chỉ chọn suất chiếu kết thúc
          trước 23h.
        </p>
      )}

      {loading ? (
        <div className="loading-message">Đang tải lịch chiếu...</div>
      ) : hasShowtimes ? (
        <div className="showtimes-container">
          {Object.entries(currentDateShowtimes).map(
            ([screenId, { screen, showtimes: screenShowtimes }]) => (
              <div key={screenId} className="screen-showtimes">
                <p className="screen-name">
                  <strong>Phòng chiếu:</strong> {screen?.name || `Phòng ${screenId}`}
                </p>
                <div className="ticket-times">
                  {screenShowtimes.map((st) => (
                    <button
                      key={st.id}
                      className="time-btn"
                      onClick={() => handleSelectShowtime(st)}
                    >
                      {formatTime(st.startTime)}
                    </button>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      ) : (
        <div className="no-showtimes">
          <p>Không có suất chiếu cho ngày này</p>
        </div>
      )}
    </div>
  );
}

