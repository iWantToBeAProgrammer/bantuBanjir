import { createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout } =
  authSlice.actions;

export const loginUser = (email, password) => async (dispatch) => {
  dispatch(loginStart());
  try {
    const response = await axiosInstance.post("/auth/login", {
      email,
      password,
    });
    dispatch(loginSuccess(response.data));
    localStorage.setItem("token", response.data.token);
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Something went wrong";
    dispatch(loginFailure(errorMessage));
    throw new Error(errorMessage);
  }
};

export const registerUser = (name, email, password) => async (dispatch) => {
  dispatch(loginStart());
  try {
    const response = await axiosInstance.post("/auth/register", {
      name,
      email,
      password,
    });
    dispatch(loginSuccess(response.data));
    localStorage.setItem("token", response.data.token);
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Something went wrong";
    dispatch(loginFailure(errorMessage));
    throw new Error(errorMessage);
  }
};

export default authSlice.reducer;
