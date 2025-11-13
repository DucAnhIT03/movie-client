import axiosClient from "../axiosClient.js";

const dashboardService = {
  // Lấy thống kê tổng quan
  getStats() {
    console.log("Calling API: GET /dashboard/stats");
    return axiosClient.get("/dashboard/stats", {
      validateStatus: () => true,
    });
  },

  // Kiểm tra tính nhất quán dữ liệu
  checkConsistency() {
    console.log("Calling API: GET /dashboard/consistency");
    return axiosClient.get("/dashboard/consistency", {
      validateStatus: () => true,
    });
  },
};

export default dashboardService;

