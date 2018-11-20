import { createHashHistory } from "history";

import { applyMiddleware, compose, createStore } from "redux";
import { connectRouter, routerMiddleware } from "connected-react-router";

import rootReducer from "@Redux/Reducers/index";

export const history = createHashHistory({
  basename: ""
});

const store = createStore(connectRouter(history)(rootReducer), {}, compose(applyMiddleware(routerMiddleware(history))));

store.subscribe(() => {
  /*eslint-disable no-undef*/
  if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
    console.log(store.getState());
  }
  /*eslint-enable no-undef*/
});
export default store;
