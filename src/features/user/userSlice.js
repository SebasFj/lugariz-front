import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // agregar estado inicial cuando lo necesitemos
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // acciones aquí luego
  },
});

export const {} = authSlice.actions;
export default authSlice.reducer;
