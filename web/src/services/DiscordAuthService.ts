import { getApiUrl } from '../utils'
import { WebRoutes } from '../WebRoutes'
import { Logger } from './Logger'

const SUPPORTED_REDIRECT_PATHNAME = [
  WebRoutes.accountMintDiscord,
  WebRoutes.accountMintDiscordCheck,
]

export enum MODE {
  check = 'check',
  mint = 'mint',
}

export type DiscordOAuthAccessTokenResponse = {
  accessToken: string
  refreshToken: string
  scope: string
  tokenType: string
  expiresIn: number
}

export type DiscordUser = {
  id: string
  username: string
  discriminator: string
  avatar: string | null
  bot?: boolean
  system?: boolean
  mfa_enabled?: boolean
  banner?: string | null
  accent_color?: number | null
  locale?: string
  verified?: boolean
  email?: string | null
}

export type AuthURLResponse = {
  authUrl: string
}

class DiscordAuth {
  private readonly logger = new Logger('DiscordAuth')

  private accessTokenRequested = false

  public code: string | null = null
  public redirectUrl: string | null = null

  public mode: MODE | null = null

  constructor() {
    this.logger.log('Constructor')

    const isRedirectedFromDiscord = SUPPORTED_REDIRECT_PATHNAME.includes(
      window.location.pathname as WebRoutes
    )

    if (isRedirectedFromDiscord) {
      let needRedirect = false
      const query = new URLSearchParams(window.location.search)
      if (query.has('code')) {
        this.code = query.get('code')
        needRedirect = true
      }

      if (query.has('redirectUrl')) {
        this.redirectUrl = query.get('redirectUrl')
        needRedirect = true
      }

      this.mode = this.mode =
        (window.location.pathname as WebRoutes) === WebRoutes.accountMintDiscord
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

    const res = await fetch(`${getApiUrl()}/discord/authUrl`, {
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

  public async getAccessToken(): Promise<DiscordOAuthAccessTokenResponse> {
    this.logger.log(`Get access token`)

    if (!this.code) {
      throw new Error('No code is provided!')
    }

    if (!this.redirectUrl) {
      this.redirectUrl = this.getRedirectUrl()
    }

    const res = await fetch(`${getApiUrl()}/discord/accessToken`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        code: this.code,
        redirectUrl: this.redirectUrl,
      }),
    })

    if (res.status !== 200 && res.status !== 201) {
      throw new Error(await res.text())
    }

    const body = (await res.json()) as DiscordOAuthAccessTokenResponse
    return body
  }

  public async encryptOAuthCodeAndRedirectUrl(
    code: string,
    redirectUrl: string
  ) {
    const res = await fetch(`${getApiUrl()}/utils/encrypt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ code, redirectUrl }),
    })

    if (res.status !== 200 && res.status !== 201) {
      throw new Error(await res.text())
    }

    const body = (await res.json()) as {
      encrypted: {
        code: Buffer
        redirectUrl: Buffer
      }
    }

    return {
      code: body.encrypted.code.toString(),
      redirectUrl: body.encrypted.redirectUrl.toString(),
    }
  }

  public getRedirectUrl = () => {
    return this.mode === MODE.mint
      ? `${window.location.origin}${WebRoutes.accountMintDiscord}`
      : `${window.location.origin}${WebRoutes.accountMintDiscordCheck}`
  }

  public async getUser(
    accessToken: DiscordOAuthAccessTokenResponse
  ): Promise<DiscordUser> {
    const res = await fetch(`${getApiUrl()}/discord/user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(accessToken),
    })

    if (res.status !== 200 && res.status !== 201) {
      throw new Error(await res.text())
    }

    const body = await res.json()
    return body as DiscordUser
  }

  public setMode(mode?: MODE) {
    this.mode = mode || null
  }
}

const discordAuthService = new DiscordAuth()
export default discordAuthService
