export type DiscordOAuthAccessTokenResponse = {
  accessToken: string;
  refreshToken: string;
  scope: string;
  tokenType: string;
  expiresIn: number;
};

export type DiscordUser = {
  id: string;
  username: string;
  discriminator: string;
  avatar: string | null;
  bot?: boolean;
  system?: boolean;
  mfa_enabled?: boolean;
  banner?: string | null;
  accent_color?: number | null;
  locale?: string;
  verified?: boolean;
  email?: string | null;
};
