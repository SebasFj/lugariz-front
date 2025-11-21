import { createSlice } from "@reduxjs/toolkit";

const appSlice = createSlice({
  name: "app",
  initialState: {},
  reducers: {
    clearAll: () => ({}), // reinicia todo el state
  },
});

export const { clearAll } = appSlice.actions;
export default appSlice.reducer;
