import axiosClient from "../axiosClient";

const userService = {
  getCurrentUser() {
    return axiosClient.get("/users/me", {
      validateStatus: () => true,
    });
  },

  updateProfile(data, avatarFile) {
    const formData = new FormData();
    
    if (avatarFile) {
      formData.append("file", avatarFile);
    }
    
    if (data.firstName) formData.append("firstName", data.firstName);
    if (data.lastName) formData.append("lastName", data.lastName);
    if (data.email) formData.append("email", data.email);
    if (data.phone) formData.append("phone", data.phone);
    if (data.address) formData.append("address", data.address);
    if (data.avatar && !avatarFile) formData.append("avatar", data.avatar);

    return axiosClient.put("/users/me", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      validateStatus: () => true,
    });
  },

  changePassword(data) {
    return axiosClient.post("/users/change-password", data, {
      validateStatus: () => true,
    });
  },
};

export default userService;

