import axiosClient from "../axiosClient.js";

const showtimeService = {
  // Lấy danh sách showtimes với filter
  getShowtimes(params = {}) {
    return axiosClient.get("/showtimes", { params }, {
      validateStatus: () => true,
    });
  },

  // Lấy showtimes theo movieId
  getShowtimesByMovie(movieId) {
    return axiosClient.get(`/showtimes/movie/${movieId}`, {
      validateStatus: () => true,
    });
  },

  // Lấy showtimes theo ngày
  getShowtimesByDate(date) {
    return axiosClient.get("/showtimes/date", { params: { date } }, {
      validateStatus: () => true,
    });
  },

  // Lấy chi tiết showtime
  getShowtimeById(id) {
    return axiosClient.get(`/showtimes/${id}`, {
      validateStatus: () => true,
    });
  },
};

export default showtimeService;

