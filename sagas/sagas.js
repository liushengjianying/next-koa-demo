import {
  all,
  fork,
  call,
  delay,
  put,
  take,
  takeLatest
} from "redux-saga/effects";
import { actionTypes, updateUser } from "../actions/actions";

export function* userInfo() {
  const actions = yield take(actionTypes.UPDATE_USER)
  yield put(updateUser(actions.userInfo))
}

export function* logout() {
  
}

export default function* rootSaga() {
  yield all([fork(userInfo), fork(logout)]);
}
