import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  updateCounter: 0,
  joinedClasses: [],
  loading: false,
  error: null,
};

export const classSlice = createSlice({
  name: "class",
  initialState,
  reducers: {
    triggerClassUpdate: (state) => {
      state.updateCounter += 1;
    },
    setJoinedClasses: (state, action) => {
      state.joinedClasses = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { triggerClassUpdate, setJoinedClasses, setLoading, setError } =
  classSlice.actions;

export default classSlice.reducer;
