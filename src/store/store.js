import { configureStore } from "@reduxjs/toolkit";
import classReducer from "./classSlice";
import userReducer from "./userSlice";
export const store = configureStore({
  reducer: {
    class: classReducer,
    user: userReducer,
  },
});
