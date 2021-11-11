import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import logger from "redux-logger";

import { TwitterAuthAction } from "./actions/twitterAuth/types";
import { Web3Action } from "./actions/web3/types";
import * as reducers from "./reducers";
import { TwitterAuthState } from "./reducers/twitterAuth";
import { Web3State } from "./reducers/web3";
import { ThunkAction } from "./utils";
import { OWSNAction } from "./actions/owsn/types";
import { OWSNState } from "./reducers/owsn";
import twitterRedirectCatcher from "./middlewares/twitterRedirectCatcher";

export type State = {
  web3: Web3State;
  twitterAuth: TwitterAuthState;
  owsn: OWSNState;
};

export type PlainAction = Web3Action | TwitterAuthAction | OWSNAction;
export type Action = PlainAction | ThunkAction;

// @ts-expect-error
const store = createStore<State, Action, any, any>(
  combineReducers(reducers),
  applyMiddleware(thunk, twitterRedirectCatcher, logger)
);

export default store;
