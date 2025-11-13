import axiosClient from "../axiosClient.js";

const bookingService = {
  // Tạo booking mới
  createBooking(data) {
    return axiosClient.post("/bookings", data, {
      validateStatus: () => true,
    });
  },

  // Lấy danh sách vé của tôi
  getMyTickets(params = {}) {
    return axiosClient.get("/bookings/my-tickets", { params }, {
      validateStatus: () => true,
    });
  },

  // Hủy booking
  cancelBooking(bookingId) {
    return axiosClient.patch("/bookings/cancel", { bookingId }, {
      validateStatus: () => true,
    });
  },
};

export default bookingService;

