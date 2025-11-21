import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // agregar estado inicial cuando lo necesitemos
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    // acciones aquí luego
  },
});

export const {} = adminSlice.actions;
export default adminSlice.reducer;
