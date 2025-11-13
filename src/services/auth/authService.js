import axiosClient from "../axiosClient";

const authService = {
  login(data) {
    return axiosClient.post("/auth/login", data, {
      validateStatus: () => true,
    });
  },

  register(data) {
    return axiosClient.post("/auth/register", data, {
      validateStatus: () => true,
    });
  },

  sendVerificationOtp(email) {
    return axiosClient.post("/auth/send-verification-otp", { email }, {
      validateStatus: () => true,
    });
  },

  verifyOtpAndRegister(data) {
    return axiosClient.post("/auth/verify-otp-register", data, {
      validateStatus: () => true,
    });
  },
};

export default authService;




