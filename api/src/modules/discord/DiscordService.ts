import { Injectable, Logger } from '@nestjs/common';
import axios, { Method } from 'axios';
import { ConfigService } from '@nestjs/config';
import { DiscordOAuthAccessTokenResponse, DiscordUser } from './types';

@Injectable()
export class DiscordService {
  private readonly logger: Logger = new Logger('DiscordService');

  private DISCORD_SCOPE: string;
  private DISCORD_API_KEY: string;
  private DISCORD_API_SECRET: string;
  private DISCORD_BOT_TOKEN: string;

  constructor(private readonly configs: ConfigService) {
    this.DISCORD_API_KEY = configs.get<string>('DISCORD_API_KEY');
    this.DISCORD_API_SECRET = configs.get<string>('DISCORD_API_SECRET');
    this.DISCORD_BOT_TOKEN = configs.get<string>('DISCORD_BOT_TOKEN');
    this.DISCORD_SCOPE = configs.get<string>('DISCORD_SCOPE');
  }

  public async getAuthLink(callbackUrl: string): Promise<string> {
    this.logger.log(`Get auth link [callbackUrl=${callbackUrl}]`);

    let url = 'https://discord.com/api/oauth2/authorize?';
    // add response type
    url += `response_type=code`;

    // add client id
    url += `&client_id=${this.DISCORD_API_KEY}`;

    // add scopes
    url += `&scope=${this.DISCORD_SCOPE}`;

    // add state
    url += `&state=15773059ghq9183habn`;

    // add redirect url
    url += `&redirect_uri=${callbackUrl}`;

    // add consents
    url += `&prompt=consent`;

    // encode url
    return encodeURI(url);
  }

  public async getAccessToken(
    code: string,
    redirectUrl: string,
  ): Promise<DiscordOAuthAccessTokenResponse> {
    this.logger.log(`[DiscordUsersService] Exchange Discord oauth2 code`);

    const params = new URLSearchParams();
    params.append('client_id', this.DISCORD_API_KEY);
    params.append('client_secret', this.DISCORD_API_SECRET);
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', redirectUrl);
    params.append('scope', this.DISCORD_SCOPE);

    let data: any;
    data = await axios.post('https://discord.com/api/v9/oauth2/token', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    data = data.data as any;
    return {
      accessToken: data.access_token,
      expiresIn: data.expires_in,
      refreshToken: data.refresh_token,
      scope: data.scope,
      tokenType: data.token_type,
    };
  }

  public async getUserByAccessToken(
    accessToken: DiscordOAuthAccessTokenResponse,
  ) {
    this.logger.log(`[DiscordUsersService] Get discord user by accessToken`);

    const me = (
      await axios.get<DiscordUser>('https://discord.com/api/v9/users/@me', {
        headers: {
          Authorization: `Bearer ${accessToken.accessToken}`,
        },
      })
    ).data;

    return me;
  }

  public async getUserById(id: string) {
    this.logger.log(`[DiscordUsersService] Get discord user by id`);

    const response = await axios.get<DiscordUser>(
      `https://discord.com/api/v9/users/${id}`,
      {
        headers: {
          Authorization: `Bot ${this.DISCORD_BOT_TOKEN}`,
        },
      },
    );

    return response.data;
  }
}
