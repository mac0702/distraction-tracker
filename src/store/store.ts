import { configureStore } from "@reduxjs/toolkit";
import distractionReducer from "./distractionSlice";

export const store = configureStore({
  reducer: {
    distraction: distractionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
