import { Dispatch } from "redux";
import { Action, State } from "./store";

export type AC<T, P> = (payload: P) => {
  type: T;
  payload: P;
};

export type ThunkAC<P> = (payload: P) => ThunkAction;

export type ThunkAction = (dispatch: Dispatch) => Promise<void>;

export type StoreAPI = {
  // @ts-expect-error
  dispatch: Dispatch<Action>;
  getState: () => State;
};
