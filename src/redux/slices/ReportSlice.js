import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

// Initial state
const initialState = {
  reports: [],
  selectedReport: null,
  loading: false,
  error: null,
};

export const fetchReports = createAsyncThunk(
  "reports/fetchReports",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/reports");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch reports"
      );
    }
  }
);

export const createReport = createAsyncThunk(
  "reports/createReport",
  async (reportData, { dispatch, rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/reports", reportData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      dispatch(fetchReports());

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create report"
      );
    }
  }
);

export const updateReportThunk = createAsyncThunk(
  "reports/updateReport",
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    try {
      // Ensure FormData is properly formatted
      let updatedData = data;
      if (!(data instanceof FormData)) {
        updatedData = new FormData();
        Object.keys(data).forEach((key) => {
          if (key === "coordinates" && typeof data[key] === "object") {
            updatedData.append(key, JSON.stringify(data[key]));
          } else if (data[key] !== undefined) {
            updatedData.append(key, data[key]);
          }
        });
      }

      const response = await axiosInstance.put(`/reports/${id}`, updatedData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      dispatch(fetchReports());

      return response.data;
    } catch (error) {
      console.error("Update error:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.message || "Failed to update report"
      );
    }
  }
);

export const deleteReportThunk = createAsyncThunk(
  "reports/deleteReport",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/reports/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete report"
      );
    }
  }
);

// Slice
const reportSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {
    selectReport: (state, action) => {
      state.selectedReport = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch reports
    builder
      .addCase(fetchReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload;
        state.error = null;
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Create report
    builder
      .addCase(createReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReport.fulfilled, (state, action) => {
        state.loading = false;
        state.reports.unshift(action.payload);
        state.error = null;
      })
      .addCase(createReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update report
    builder
      .addCase(updateReportThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateReportThunk.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.reports.findIndex(
          (report) => report.id === action.payload.id
        );
        if (index !== -1) {
          state.reports[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateReportThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete report
    builder
      .addCase(deleteReportThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteReportThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = state.reports.filter(
          (report) => report.id !== action.payload
        );
        state.error = null;
      })
      .addCase(deleteReportThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { selectReport, setError, clearError } = reportSlice.actions;

export default reportSlice.reducer;
