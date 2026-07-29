import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import leadsReducer from "../features/leads/leadsSlice";
import themeReducer from "../features/theme/themeSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    leads: leadsReducer,
    theme: themeReducer,
  },
});

export default store;
