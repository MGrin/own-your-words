import { Reducer } from "react";
import {
  TwitterAuthAction,
  TwitterAuthActionPayload,
  TwitterAuthActionType,
} from "../actions/twitterAuth/types";

export type TwitterAuthState = {
  loading?: boolean;
  error?: Error;
};

const initialState: TwitterAuthState = {
  loading: false,
};

const reducer: Reducer<TwitterAuthState, TwitterAuthAction> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case TwitterAuthActionType.getRequestToken: {
      return {
        ...state,
        error: undefined,
        loading: true,
      };
    }
    case TwitterAuthActionType.readRequestTokenFailure: {
      const payload =
        action.payload as TwitterAuthActionPayload[TwitterAuthActionType.readRequestTokenFailure];
      return {
        ...state,
        loading: false,
        error: payload.error,
      };
    }

    case TwitterAuthActionType.readRequestTokenSuccess: {
      return {
        ...state,
        loading: false,
        error: undefined,
      };
    }

    case TwitterAuthActionType.fetchAccessTokenStart: {
      return {
        ...state,
        error: undefined,
        loading: true,
      };
    }

    case TwitterAuthActionType.fetchAccessTokenFailure: {
      const payload =
        action.payload as TwitterAuthActionPayload[TwitterAuthActionType.fetchAccessTokenFailure];
      return {
        ...state,
        loading: false,
        error: payload.error,
      };
    }

    case TwitterAuthActionType.fetchAccessTokenSuccess: {
      const payload =
        action.payload as TwitterAuthActionPayload[TwitterAuthActionType.fetchAccessTokenSuccess];
      return {
        ...state,
        loading: false,
        error: undefined,
      };
    }

    default: {
      return state;
    }
  }
};

export default reducer;
