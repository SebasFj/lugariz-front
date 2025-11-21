import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // agregar estado inicial cuando lo necesitemos
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // acciones aquí luego
  },
});

export const {} = uiSlice.actions;
export default uiSlice.reducer;
