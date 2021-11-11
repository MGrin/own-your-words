import twitterAuthService, { MODE } from "../../services/TwitterAuthService";
import { mintTwitter } from "../actions/owsn";
import { fetchAccessToken } from "../actions/twitterAuth";
import { Web3ActionType } from "../actions/web3/types";
import { PlainAction } from "../store";
import { StoreAPI } from "../utils";

type NextFn = (a: PlainAction) => void;
export default (store: StoreAPI) => (next: NextFn) => (action: PlainAction) => {
  next(action);

  if (!twitterAuthService.mode) {
    return;
  }

  if (action.type !== Web3ActionType.connectSuccess) {
    return;
  }

  switch (twitterAuthService.mode) {
    case MODE.check: {
      store.dispatch(fetchAccessToken());
      return;
    }
    case MODE.mint: {
      if (!twitterAuthService.oauthToken || !twitterAuthService.oauthVerifier) {
        return;
      }

      store.dispatch(
        mintTwitter({
          oauthToken: twitterAuthService.oauthToken!,
          oauthVerifier: twitterAuthService.oauthVerifier!,
        })
      );
      return;
    }
  }
};
