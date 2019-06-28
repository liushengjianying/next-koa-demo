import { createStore, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import allReducers from "../reducer/index";
import rootSaga from "../sagas/sagas";
import { add, asyncAdd } from "../actions/actions";

// console.log("saga", rootSaga);

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

  return store;
}
