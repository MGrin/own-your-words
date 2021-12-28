import { getApiUrl } from '../utils'
import { WebRoutes } from '../WebRoutes'
import { Logger } from './Logger'

const SUPPORTED_REDIRECT_PATHNAME = [
  WebRoutes.accountMintTwitter,
  WebRoutes.accountMintTwitterCheck,
]

export enum MODE {
  check = 'check',
  mint = 'mint',
}

export type TwitterOAuthAccessTokenResponse = {
  oauth_token: string
  oauth_token_secret: string
  user_id: string
  screen_name: string
}

export type AuthURLResponse = {
  authUrl: string
}

class TwitterAuth {
  private readonly logger = new Logger('TwitterAuth')

  public oauthToken: string | null = null

  public oauthVerifier: string | null = null

  public mode: MODE | null = null

  constructor() {
    this.logger.log('Constructor')

    const isRedirectedFromTwitter = SUPPORTED_REDIRECT_PATHNAME.includes(
      window.location.pathname as WebRoutes
    )

    if (isRedirectedFromTwitter) {
      let needRedirect = false
      const query = new URLSearchParams(window.location.search)
      if (query.has('oauth_token')) {
        this.oauthToken = query.get('oauth_token')
        needRedirect = true
      }

      if (query.has('oauth_verifier')) {
        this.oauthVerifier = query.get('oauth_verifier')
        needRedirect = true
      }

      this.mode =
        (window.location.pathname as WebRoutes) === WebRoutes.accountMintTwitter
          ? MODE.mint
          : MODE.check

      if (needRedirect) {
        window.history.replaceState(
          {},
          'Own Your Words',
          `${window.location.origin}${WebRoutes.accountMint}`
        )
      }
    }
  }

  public async getAuthUrl(callbackUrl: string): Promise<string> {
    this.logger.log(`Get auth url [callbackUrl=${callbackUrl}]`)

    const res = await fetch(`${getApiUrl()}/twitter/authUrl`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        callbackUrl,
      }),
    })

    if (res.status !== 200 && res.status !== 201) {
      throw new Error(await res.text())
    }

    const body = (await res.json()) as AuthURLResponse
    return body.authUrl
  }

  public async getAccessToken(): Promise<TwitterOAuthAccessTokenResponse> {
    this.logger.log(`Get access token`)

    if (!this.oauthToken) {
      throw new Error('No oauthToken is provided!')
    }

    if (!this.oauthVerifier) {
      throw new Error('No oauthToken is provided!')
    }

    const res = await fetch(`${getApiUrl()}/twitter/accessToken`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        oauthToken: this.oauthToken,
        oauthVerifier: this.oauthVerifier,
      }),
    })

    if (res.status !== 200 && res.status !== 201) {
      throw new Error(await res.text())
    }

    const body = (await res.json()) as TwitterOAuthAccessTokenResponse
    return body
  }

  public async encryptOAuthTokenAndVerifier(
    oauthToken: string,
    oauthVerifier: string
  ) {
    const res = await fetch(`${getApiUrl()}/utils/encrypt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ oauthToken, oauthVerifier }),
    })

    if (res.status !== 200 && res.status !== 201) {
      throw new Error(await res.text())
    }

    const body = (await res.json()) as {
      encrypted: {
        oauthToken: Buffer
        oauthVerifier: Buffer
      }
    }

    return {
      oauthToken: body.encrypted.oauthToken.toString(),
      oauthVerifier: body.encrypted.oauthVerifier.toString(),
    }
  }

  public setMode(mode?: MODE) {
    this.mode = mode || null
  }
}

const twitterAuthService = new TwitterAuth()
export default twitterAuthService
