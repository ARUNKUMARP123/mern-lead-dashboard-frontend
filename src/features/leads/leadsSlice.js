import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

export const fetchLeads = createAsyncThunk(
  "leads/fetchLeads",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/leads", { params });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch leads");
    }
  }
);

export const fetchStats = createAsyncThunk(
  "leads/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/leads/stats");
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch stats");
    }
  }
);

export const createLead = createAsyncThunk(
  "leads/createLead",
  async (leadData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/leads", leadData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create lead");
    }
  }
);

export const updateLead = createAsyncThunk(
  "leads/updateLead",
  async ({ id, leadData }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/leads/${id}`, leadData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update lead");
    }
  }
);

export const deleteLead = createAsyncThunk(
  "leads/deleteLead",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/leads/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete lead");
    }
  }
);

const initialState = {
  items: [],
  total: 0,
  page: 1,
  pages: 1,
  stats: {
    totalLeads: 0,
    qualifiedLeads: 0,
    closedDeals: 0,
    lostLeads: 0,
    revenue: 0,
    statusBreakdown: [],
  },
  queryParams: {
    search: "",
    status: "All",
    sortBy: "createdAt",
    order: "desc",
    page: 1,
    limit: 10,
  },
  status: "idle",
  statsStatus: "idle",
  mutationStatus: "idle",
  error: null,
};

const leadsSlice = createSlice({
  name: "leads",
  initialState,
  reducers: {
    setQueryParams: (state, action) => {
      state.queryParams = { ...state.queryParams, ...action.payload };
    },
    resetQueryParams: (state) => {
      state.queryParams = initialState.queryParams;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeads.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchLeads.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.leads;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
      })
      .addCase(fetchLeads.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchStats.pending, (state) => {
        state.statsStatus = "loading";
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.statsStatus = "succeeded";
        state.stats = action.payload;
      })
      .addCase(fetchStats.rejected, (state, action) => {
        state.statsStatus = "failed";
        state.error = action.payload;
      })
      .addCase(createLead.pending, (state) => {
        state.mutationStatus = "loading";
      })
      .addCase(createLead.fulfilled, (state) => {
        state.mutationStatus = "succeeded";
      })
      .addCase(createLead.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.error = action.payload;
      })
      .addCase(updateLead.fulfilled, (state, action) => {
        const idx = state.items.findIndex((l) => l._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteLead.fulfilled, (state, action) => {
        state.items = state.items.filter((l) => l._id !== action.payload);
        state.total = Math.max(0, state.total - 1);
      });
  },
});

export const { setQueryParams, resetQueryParams } = leadsSlice.actions;
export default leadsSlice.reducer;
