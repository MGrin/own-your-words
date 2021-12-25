export type TokenSignatureParams = {
  oauth_consumer_key: string;
  oauth_version: '1.0';
  oauth_signature_method: 'HMAC-SHA1';
  oauth_timestamp: string;
  oauth_nonce: string;
};

export type RequestTokenSignatureParams = TokenSignatureParams & {
  oauth_callback: string;
};

export type AccessTokenSignatureParams = TokenSignatureParams & {
  oauth_token: string;
  oauth_verifier: string;
};

export type TwitterOAuthRequestTokenResponse = {
  oauth_token: string;
  oauth_verifier: string;
  oauth_callback_confirmed: 'true' | 'false';
};

export type TwitterOAuthAccessTokenResponse = {
  oauth_token: string;
  oauth_token_secret: string;
  user_id: string;
  screen_name: string;
};

export type TwitterBearerAccessTokenResponse = {
  token_type: string;
  access_token: string;
};

export type AuthURLResponse = {
  authUrl: string;
};

export type TwitterUser = {
  id: number;
  name: string;
  screen_name: string;
  location: string;
  description: string;
  followers_count: number;
  friends_count: number;
  profile_image_url: string;
  profile_image_url_https: string;
};

export type TwitterPost = {
  created_at: string;
  id: number;
  text: string;
  truncated: boolean;
  in_reply_to_status_id: number;
  in_reply_to_user_id: number;
  in_reply_to_screen_name: string;
  user: TwitterUser;
  is_quote_status: boolean;
  retweet_count: number;
  favorite_count: number;
};
