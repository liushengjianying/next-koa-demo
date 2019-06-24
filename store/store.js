import { createStore, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";

import { initialState } from "../reducer/count";
import { user } from "../reducer/user";
import allReducers from "../reducer/index";
import rootSaga from "../sagas/sagas";
import { add, asyncAdd } from "../actions/actions";

console.log("saga", rootSaga);

// const store = createStore(allReducers, {
//   count: initialState,
//   user
// });

const initState = {
  count: initialState,
  user
};

const bindMiddleware = middleware => {
  if (process.env.NODE_ENV !== "production") {
    const { composeWithDevTools } = require("redux-devtools-extension");
    return composeWithDevTools(applyMiddleware(...middleware));
  }
  return applyMiddleware(...middleware);
};

export default function configureStore(initialState) {
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(allReducers, initialState, bindMiddleware([sagaMiddleware]));

  store.sagaTask = sagaMiddleware.run(rootSaga);

  store.dispatch(add(3));
  store.subscribe(() => {
    console.log("changed", store.getState());
  });
  store.dispatch(asyncAdd(5));
  store.dispatch({ type: "UPDATE_USERNAME", name: "aoch" });

  return store;
}
