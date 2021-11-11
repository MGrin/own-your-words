import { readRequestTokenFailure } from ".";
import { Logger } from "../../../services/Logger";
import twitterAuthService from "../../../services/TwitterAuthService";
import { ThunkAC } from "../../utils";
import { checkAccountAvailability } from "../owsn";
import {
  fetchAccessTokenStart,
  fetchAccessTokenSuccess,
  fetchAccessTokenFailure,
  getRequestToken,
} from "./plain";
import { TwitterAuthActionPayload, TwitterAuthActionType } from "./types";

const logger = new Logger("TwitterAuthAsyncActions");

export const fetchRequestToken: ThunkAC<
  TwitterAuthActionPayload[TwitterAuthActionType.getRequestToken]
> =
  ({ callbackUrl }) =>
  async (dispatch) => {
    dispatch(getRequestToken({ callbackUrl }));
    try {
      const authUrl = await twitterAuthService.getAuthUrl(callbackUrl);
      window.location.href = authUrl;
    } catch (error) {
      logger.error(error as Error);
      dispatch(readRequestTokenFailure({ error: error as Error }));
    }
  };

export const fetchAccessToken: ThunkAC<void> = () => async (dispatch) => {
  dispatch(fetchAccessTokenStart());
  const next = async () => {
    try {
      const data = await twitterAuthService.getAccessToken();
      dispatch(fetchAccessTokenSuccess(data));
      dispatch(
        // @ts-expect-error
        checkAccountAvailability({ snName: "twitter", snId: data.user_id })
      );
    } catch (error) {
      logger.error(error as Error);
      dispatch(fetchAccessTokenFailure({ error: error as Error }));
    }
  };

  if (twitterAuthService) {
    return next();
  }

  setTimeout(next, 1);
};
