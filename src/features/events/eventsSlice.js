import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // agregar estado inicial cuando lo necesitemos
};

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    // acciones aquí luego
  },
});

export const {} = eventsSlice.actions;
export default eventsSlice.reducer;
