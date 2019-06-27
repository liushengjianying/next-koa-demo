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
import { logOut } from '../server/api'

export function* userInfo() {
  while (true) {
    const actions = yield take(actionTypes.UPDATE_USER);
    yield put(updateUser(actions.userInfo));
  }
}

export function* logout() {
  while (true) {
    yield take(actionTypes.LOGOUT);
    const res = yield call(logOut)
    if (res.status === 200) {
      yield put({ type: "TO_LOGIN_OUT"})
    } else {
      console.log('login out failed:', res)
    }
  }
}

export default function* rootSaga() {
  yield all([fork(userInfo), fork(logout)]);
}
