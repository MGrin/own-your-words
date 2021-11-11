import { TwitterOAuthAccessTokenResponse } from "../../../services/TwitterAuthService";

export enum TwitterAuthActionType {
  getRequestToken = "TWITTER_AUTH/getRequestToken/",
  readRequestTokenSuccess = "TWITTER_AUTH/receiveRequestToken/SUCCEED",
  readRequestTokenFailure = "TWITTER_AUTH/receiveRequestToken/FAILURE",

  fetchAccessTokenStart = "TWITTER_AUTH/fetchAccessToken/START",
  fetchAccessTokenSuccess = "TWITTER_AUTH/fetchAccessToken/SUCCESS",
  fetchAccessTokenFailure = "TWITTER_AUTH/fetchAccessToken/FAILURE",
}

export type TwitterAuthActionPayload = {
  [TwitterAuthActionType.getRequestToken]: {
    callbackUrl: string;
  };
  [TwitterAuthActionType.readRequestTokenSuccess]: {
    oauthToken: string;
    oauthVerifier: string;
  };
  [TwitterAuthActionType.readRequestTokenFailure]: {
    error: Error;
  };

  [TwitterAuthActionType.fetchAccessTokenStart]: void;
  [TwitterAuthActionType.fetchAccessTokenSuccess]: TwitterOAuthAccessTokenResponse;
  [TwitterAuthActionType.fetchAccessTokenFailure]: {
    error: Error;
  };
};

export type TwitterAuthAction =
  | {
      type: TwitterAuthActionType.getRequestToken;
      payload: TwitterAuthActionPayload[TwitterAuthActionType.getRequestToken];
    }
  | {
      type: TwitterAuthActionType.readRequestTokenSuccess;
      payload: TwitterAuthActionPayload[TwitterAuthActionType.readRequestTokenSuccess];
    }
  | {
      type: TwitterAuthActionType.readRequestTokenFailure;
      payload: TwitterAuthActionPayload[TwitterAuthActionType.readRequestTokenFailure];
    }
  | {
      type: TwitterAuthActionType.fetchAccessTokenStart;
      payload: TwitterAuthActionPayload[TwitterAuthActionType.fetchAccessTokenStart];
    }
  | {
      type: TwitterAuthActionType.fetchAccessTokenSuccess;
      payload: TwitterAuthActionPayload[TwitterAuthActionType.fetchAccessTokenSuccess];
    }
  | {
      type: TwitterAuthActionType.fetchAccessTokenFailure;
      payload: TwitterAuthActionPayload[TwitterAuthActionType.fetchAccessTokenFailure];
    };
