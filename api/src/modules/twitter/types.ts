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
  oauth_verifier: string;
  user_id: string;
  screen_name: string;
};

export type AuthURLResponse = {
  authUrl: string;
};
