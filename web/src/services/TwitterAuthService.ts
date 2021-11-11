import { API_URL } from "../constants";
import { mintTwitter } from "../redux/actions/owsn";
import { fetchAccessToken } from "../redux/actions/twitterAuth";
import store from "../redux/store";
import { ThunkAction } from "../redux/utils";
import { WebRoutes } from "../WebRoutes";
import { Logger } from "./Logger";

const SUPPORTED_REDIRECT_PATHNAME = [WebRoutes.accounts];
const REDIRECT_HASH_PREFIX = "#twitter-";

export enum MODE {
  check = "check",
  mint = "mint",
}

export type TwitterOAuthAccessTokenResponse = {
  oauth_token: string;
  oauth_token_secret: string;
  user_id: string;
  screen_name: string;
};

export type AuthURLResponse = {
  authUrl: string;
};

class TwitterAuth {
  private readonly logger = new Logger("TwitterAuth");

  public oauthToken: string | null = null;
  public oauthVerifier: string | null = null;
  public mode: MODE | null = null;

  constructor() {
    this.logger.log("Constructor");

    const isRedirectedFromTwitter =
      SUPPORTED_REDIRECT_PATHNAME.indexOf(
        window.location.pathname as WebRoutes
      ) !== -1 && window.location.hash.indexOf(REDIRECT_HASH_PREFIX) === 0;

    if (isRedirectedFromTwitter) {
      const query = new URLSearchParams(window.location.search);
      if (query.has("oauth_token")) {
        this.oauthToken = query.get("oauth_token");
      }

      if (query.has("oauth_verifier")) {
        this.oauthVerifier = query.get("oauth_verifier");
      }

      this.mode = window.location.hash.substring(
        REDIRECT_HASH_PREFIX.length
      ) as MODE;

      window.history.replaceState(
        {},
        document.title,
        `${window.location.origin}${window.location.pathname}`
      );
    }
  }

  public async getAuthUrl(callbackUrl: string): Promise<string> {
    this.logger.log(`Get auth url [callbackUrl=${callbackUrl}]`);

    const res = await fetch(`${API_URL}/twitter/authUrl`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        callbackUrl,
      }),
    });

    if (res.status !== 200 && res.status !== 201) {
      throw new Error(await res.text());
    }

    const body = (await res.json()) as AuthURLResponse;
    return body.authUrl;
  }

  public async getAccessToken(): Promise<TwitterOAuthAccessTokenResponse> {
    this.logger.log(`Get access token`);

    if (!this.oauthToken) {
      throw new Error("No oauthToken is provided!");
    }

    if (!this.oauthVerifier) {
      throw new Error("No oauthToken is provided!");
    }

    const res = await fetch(`${API_URL}/twitter/accessToken`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        oauthToken: this.oauthToken,
        oauthVerifier: this.oauthVerifier,
      }),
    });

    if (res.status !== 200 && res.status !== 201) {
      throw new Error(await res.text());
    }

    const body = (await res.json()) as TwitterOAuthAccessTokenResponse;
    return body;
  }
}

const twitterAuthService = new TwitterAuth();
export default twitterAuthService;
