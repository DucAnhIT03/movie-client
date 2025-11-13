import axiosClient from "../axiosClient.js";

const paymentService = {
  // Tạo payment mới
  createPayment(data) {
    return axiosClient.post("/payments", data, {
      validateStatus: () => true,
    });
  },

  // Lấy thông tin payment
  getPayment(paymentId) {
    return axiosClient.get(`/payments/${paymentId}`, {
      validateStatus: () => true,
    });
  },

  // Hoàn thành payment
  completePayment(paymentId, transactionId, success = true) {
    return axiosClient.patch(
      `/payments/${paymentId}/complete`,
      { transactionId, success },
      {
        validateStatus: () => true,
      }
    );
  },
};

export default paymentService;

