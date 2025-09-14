import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export interface DistractionEvent {
  _id?: string;
  reason: string;
  timestamp: number;
  notes?: string;
  duration?: number;
  category?: string;
  impact?: "low" | "medium" | "high";
}

interface DistractionState {
  events: DistractionEvent[];
  loading: boolean;
  error: string | null;
}

const initialState: DistractionState = {
  events: [],
  loading: false,
  error: null,
};

// Async thunks for API calls
export const fetchDistractionsAsync = createAsyncThunk(
  "distractions/fetchAll",
  async () => {
    const response = await fetch("/api/distractions");
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Could not fetch distractions");
    }
    return response.json();
  }
);

export const logDistractionAsync = createAsyncThunk(
  "distractions/log",
  async (event: DistractionEvent) => {
    const response = await fetch("/api/distractions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Could not log distraction");
    }
    return response.json();
  }
);

const distractionSlice = createSlice({
  name: "distraction",
  initialState,
  reducers: {
    clearEvents(state) {
      state.events = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDistractionsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDistractionsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(fetchDistractionsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch distractions";
      })
      .addCase(logDistractionAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logDistractionAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.events.unshift(action.payload);
      })
      .addCase(logDistractionAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to log distraction";
      });
  },
});

export const { clearEvents } = distractionSlice.actions;
export default distractionSlice.reducer;
