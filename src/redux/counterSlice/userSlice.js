import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateInfo: (state, action) => {
      // Hỗ trợ cả cấu trúc mới { token, profile } và cấu trúc cũ
      if (action.payload.token && action.payload.profile) {
        state.token = action.payload.token;
        state.user = action.payload.profile;
      } else {
        state.user = action.payload;
      }
      localStorage.setItem("infoState", JSON.stringify(state.user));
      if (state.token) {
        localStorage.setItem("accessToken", state.token);
      }
    },
    loadInfo: (state) => {
      // Try to load from infoState first (old format)
      const saved = localStorage.getItem("infoState");
      const token = localStorage.getItem("accessToken");
      
      // Also try to load from "user" key (new format)
      const savedUser = localStorage.getItem("user");
      
      if (savedUser) {
        try {
          state.user = JSON.parse(savedUser);
        } catch (e) {
          console.error("Error parsing user from localStorage:", e);
        }
      } else if (saved) {
        try {
          state.user = JSON.parse(saved);
        } catch (e) {
          console.error("Error parsing infoState from localStorage:", e);
        }
      }
      
      if (token) {
        state.token = token;
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("infoState");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      localStorage.removeItem("adminAuth");
    },
  },
});

export const { updateInfo, loadInfo, logout } = userSlice.actions;
export default userSlice.reducer;
