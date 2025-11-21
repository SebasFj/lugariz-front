import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // agregar estado inicial cuando lo necesitemos
};

const placesSlice = createSlice({
  name: 'places',
  initialState,
  reducers: {
    // acciones aquí luego
  },
});

export const {} = placesSlice.actions;
export default placesSlice.reducer;
