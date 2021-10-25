import { Injectable, Logger } from '@nestjs/common';
import axios, { Method } from 'axios';
import { v4 as uuid } from 'uuid';
import { HmacSHA1, enc } from 'crypto-js';
import {
  AccessTokenSignatureParams,
  RequestTokenSignatureParams,
  TwitterOAuthAccessTokenResponse,
  TwitterOAuthRequestTokenResponse,
} from './types';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TwitterService {
  private readonly logger: Logger = new Logger('TwitterService');

  private TWITTER_API_KEY: string;
  private TWITTER_API_SECRET: string;

  constructor(private readonly configs: ConfigService) {
    this.TWITTER_API_KEY = configs.get<string>('TWITTER_API_KEY');
    this.TWITTER_API_SECRET = configs.get<string>('TWITTER_API_SECRET');
  }

  public async getAuthLink(callbackUrl: string): Promise<string> {
    this.logger.log(`Get auth link [callbackUrl=${callbackUrl}]`);

    const method = 'POST';
    const apiUrl = 'https://api.twitter.com/oauth/request_token';
    const oauthSignature = await this.requestTokenSignature(
      method,
      apiUrl,
      callbackUrl,
    );

    const res = await axios({
      url: apiUrl,
      method,
      headers: {
        Authorization: `OAuth ${oauthSignature}`,
        accept: '*/*',
      },
    });

    const responseText = res.data as string;
    const requestTokenData =
      this.parseOAuthRequestToken<TwitterOAuthRequestTokenResponse>(
        responseText,
      );
    if (requestTokenData.oauth_callback_confirmed !== 'true') {
      throw new Error('Callback url is not confirmed');
    }

    return `https://api.twitter.com/oauth/authorize?oauth_token=${requestTokenData.oauth_token}`;
  }

  public async getAccessToken(
    oauthToken: string,
    oauthVerifier: string,
  ): Promise<TwitterOAuthAccessTokenResponse> {
    this.logger.log(`Get access token`);

    const method = 'POST';
    const apiUrl = 'https://api.twitter.com/oauth/access_token';

    const oauthSignature = await this.accessTokenSignature(
      method,
      apiUrl,
      oauthToken,
      oauthVerifier,
    );

    const res = await axios({
      url: apiUrl,
      method,
      headers: {
        Authorization: `OAuth ${oauthSignature}`,
        accept: '*/*',
      },
    });
    const responseText = res.data as string;
    return this.parseOAuthRequestToken<TwitterOAuthAccessTokenResponse>(
      responseText,
    );
  }

  private async requestTokenSignature(
    method: Method,
    apiUrl: string,
    callbackUrl: string,
  ) {
    const params: RequestTokenSignatureParams = {
      oauth_consumer_key: this.TWITTER_API_KEY,
      oauth_version: '1.0',
      oauth_signature_method: 'HMAC-SHA1',
      oauth_callback: encodeURIComponent(callbackUrl),
      oauth_timestamp: (Date.now() / 1000).toFixed(),
      oauth_nonce: uuid(),
    };

    return this.makeSignature(params, method, apiUrl);
  }

  private async accessTokenSignature(
    method: Method,
    apiUrl: string,
    oauthToken: string,
    oauthVerifier: string,
  ) {
    const params: AccessTokenSignatureParams = {
      oauth_consumer_key: this.TWITTER_API_KEY,
      oauth_version: '1.0',
      oauth_signature_method: 'HMAC-SHA1',
      oauth_token: oauthToken,
      oauth_verifier: oauthVerifier,
      oauth_timestamp: (Date.now() / 1000).toFixed(),
      oauth_nonce: uuid(),
    };

    return this.makeSignature(params, method, apiUrl);
  }

  private parseOAuthRequestToken<T>(responseText: string): T {
    return responseText.split('&').reduce((prev, el) => {
      const [key, value] = el.split('=');
      return { ...prev, [key]: value };
    }, {}) as T;
  }

  private async makeSignature(
    params: RequestTokenSignatureParams | AccessTokenSignatureParams,
    method: Method,
    apiUrl: string,
  ) {
    const paramsBaseString = Object.keys(params)
      .sort()
      .reduce((prev, el) => {
        return (prev += `&${el}=${params[el]}`);
      }, '')
      .substr(1);

    const signatureBaseString = `${method.toUpperCase()}&${encodeURIComponent(
      apiUrl,
    )}&${encodeURIComponent(paramsBaseString)}`;

    const signingKey = `${encodeURIComponent(this.TWITTER_API_SECRET)}&`;

    const oauth_signature = enc.Base64.stringify(
      HmacSHA1(signatureBaseString, signingKey),
    );

    const paramsWithSignature = {
      ...params,
      oauth_signature: encodeURIComponent(oauth_signature),
    };

    return Object.keys(paramsWithSignature)
      .sort()
      .reduce((prev, el) => {
        return (prev += `,${el}="${paramsWithSignature[el]}"`);
      }, '')
      .substr(1);
  }
}
