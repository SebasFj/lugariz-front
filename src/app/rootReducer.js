import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import userReducer from "../features/user/userSlice";
import placesReducer from "../features/places/placesSlice";
import eventsReducer from "../features/events/eventsSlice";
import adminReducer from "../features/admin/adminSlice";
import uiReducer from "../features/ui/uiSlice";
import appReducer, {clearAll} from "../features/app/appSlice"

const appReducerCombined = combineReducers({
  auth: authReducer,
  user: userReducer,
  places: placesReducer,
  events: eventsReducer,
  admin: adminReducer,
  ui: uiReducer,
  app: appReducer
});

const rootReducer = (state, action) => {
  if (action.type === clearAll.type) {
    state = undefined; // reset total del store
  }
  return appReducerCombined(state, action);
};



export default rootReducer;
