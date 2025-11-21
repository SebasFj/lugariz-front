// import { configureStore } from '@reduxjs/toolkit';
// import authReducer from '../features/auth/authSlice';
// import userReducer from '../features/user/userSlice';
// import placesReducer from '../features/places/placesSlice';
// import eventsReducer from '../features/events/eventsSlice';
// import adminReducer from '../features/admin/adminSlice';
// import uiReducer from '../features/ui/uiSlice';

// const store = configureStore({
//   reducer: {
//     auth: authReducer,
//     user: userReducer,
//     places: placesReducer,
//     events: eventsReducer,
//     admin: adminReducer,
//     ui: uiReducer,
//   },
// });

// export default store;

import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // localStorage
import rootReducer from "./rootReducer"; // nuevo archivo

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "user", "places", "events", "admin", "ui"], // slices a persistir
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/PAUSE",
          "persist/FLUSH",
          "persist/PURGE",
          "persist/REGISTER",
        ],
      },
    }),
});

export const persistor = persistStore(store);
export default store;

