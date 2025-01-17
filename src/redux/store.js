import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import reportReducer from "./slices/ReportSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    reports: reportReducer,
  },
});

export default store;
