import {
  all,
  fork,
  call,
  delay,
  put,
  take,
  takeLatest
} from "redux-saga/effects";
import { actionTypes, add } from "../actions/actions";


export function* asyncAdd() {
  while (true) {
    const actions = yield take(actionTypes.ASYNC_ADD);
    yield delay(1000);
    yield put(add(actions.num));
    // yield put({ type: actionTypes.ADD, num: actions.num})
  }
}

export default function* rootSaga() {
  yield all([fork(asyncAdd)]);
}
