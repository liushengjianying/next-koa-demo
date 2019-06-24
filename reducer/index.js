import { combineReducers } from "redux";
import countReducer from "./count";
import userReducer from "./user";

const allReducers = combineReducers({
  count: countReducer,
  user: userReducer
});

export default allReducers