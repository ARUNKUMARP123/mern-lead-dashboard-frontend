import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "leadDashboardThemeMode";

const getInitialMode = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
};

const initialState = {
  mode: getInitialMode(),
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
      localStorage.setItem(STORAGE_KEY, state.mode);
    },
    setMode: (state, action) => {
      state.mode = action.payload;
      localStorage.setItem(STORAGE_KEY, state.mode);
    },
  },
});

export const { toggleMode, setMode } = themeSlice.actions;
export default themeSlice.reducer;
