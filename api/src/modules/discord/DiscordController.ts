import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { DiscordService } from './DiscordService';
import { DiscordOAuthAccessTokenResponse, DiscordUser } from './types';

@Controller('discord')
export class DiscordController {
  constructor(private readonly discordService: DiscordService) {}

  @Post('authUrl')
  public async getAuthUrl(
    @Body('callbackUrl') callbackUrl: string,
  ): Promise<{ authUrl: string }> {
    const authUrl = await this.discordService.getAuthLink(callbackUrl);
    return {
      authUrl,
    };
  }

  @Post('user')
  public async getUser(
    @Body() accessToken: DiscordOAuthAccessTokenResponse,
  ): Promise<DiscordUser> {
    const user = await this.discordService.getUserByAccessToken(accessToken);
    return user;
  }

  @Post('accessToken')
  public async getAccessToken(
    @Body('code') code: string,
    @Body('redirectUrl') redirectUrl: string,
  ): Promise<unknown> {
    const accessToken = await this.discordService.getAccessToken(
      code,
      redirectUrl,
    );
    return accessToken;
  }
}
