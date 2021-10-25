import { Body, Controller, Post, Req } from '@nestjs/common';
import { TwitterService } from './TwitterService';
import { AuthURLResponse, TwitterOAuthAccessTokenResponse } from './types';

@Controller('twitter')
export class TwitterController {
  constructor(private readonly twitterService: TwitterService) {}

  @Post('authUrl')
  public async getAuthUrl(
    @Body('callbackUrl') callbackUrl: string,
  ): Promise<AuthURLResponse> {
    const authUrl = await this.twitterService.getAuthLink(callbackUrl);
    return {
      authUrl,
    };
  }

  @Post('accessToken')
  public async getAccessToken(
    @Body('oauthToken') oauthToken: string,
    @Body('oauthVerifier') oauthVerifier: string,
  ): Promise<TwitterOAuthAccessTokenResponse> {
    const accessToken = await this.twitterService.getAccessToken(
      oauthToken,
      oauthVerifier,
    );
    return accessToken;
  }
}
