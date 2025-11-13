import axiosClient from "../axiosClient.js";

const seatService = {
  // Lấy danh sách ghế theo showtimeId
  getSeatsByShowtime(showtimeId) {
    return axiosClient.get(`/seats/showtime/${showtimeId}`, {
      validateStatus: () => true,
    });
  },

  // Lấy danh sách tất cả ghế
  getAllSeats() {
    return axiosClient.get("/seats", {
      validateStatus: () => true,
    });
  },

  // Lấy chi tiết ghế
  getSeatById(id) {
    return axiosClient.get(`/seats/${id}`, {
      validateStatus: () => true,
    });
  },
};

export default seatService;

