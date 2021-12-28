import type { DiscordOAuthAccessTokenResponse } from '../../../services/DiscordAuthService'

export enum DiscordAuthActionType {
  getRequestToken = 'Discord_AUTH/getRequestToken/',
  readRequestTokenSuccess = 'Discord_AUTH/receiveRequestToken/SUCCEED',
  readRequestTokenFailure = 'Discord_AUTH/receiveRequestToken/FAILURE',

  fetchAccessTokenStart = 'Discord_AUTH/fetchAccessToken/START',
  fetchAccessTokenSuccess = 'Discord_AUTH/fetchAccessToken/SUCCESS',
  fetchAccessTokenFailure = 'Discord_AUTH/fetchAccessToken/FAILURE',
}

export type DiscordAuthActionPayload = {
  [DiscordAuthActionType.getRequestToken]: {
    callbackUrl: string
  }
  [DiscordAuthActionType.readRequestTokenSuccess]: {
    code: string
    redirectUrl: string
  }
  [DiscordAuthActionType.readRequestTokenFailure]: {
    error: Error
  }

  [DiscordAuthActionType.fetchAccessTokenStart]: void
  [DiscordAuthActionType.fetchAccessTokenSuccess]: DiscordOAuthAccessTokenResponse
  [DiscordAuthActionType.fetchAccessTokenFailure]: {
    error: Error
  }
}

export type DiscordAuthAction =
  | {
      type: DiscordAuthActionType.getRequestToken
      payload: DiscordAuthActionPayload[DiscordAuthActionType.getRequestToken]
    }
  | {
      type: DiscordAuthActionType.readRequestTokenSuccess
      payload: DiscordAuthActionPayload[DiscordAuthActionType.readRequestTokenSuccess]
    }
  | {
      type: DiscordAuthActionType.readRequestTokenFailure
      payload: DiscordAuthActionPayload[DiscordAuthActionType.readRequestTokenFailure]
    }
  | {
      type: DiscordAuthActionType.fetchAccessTokenStart
      payload: DiscordAuthActionPayload[DiscordAuthActionType.fetchAccessTokenStart]
    }
  | {
      type: DiscordAuthActionType.fetchAccessTokenSuccess
      payload: DiscordAuthActionPayload[DiscordAuthActionType.fetchAccessTokenSuccess]
    }
  | {
      type: DiscordAuthActionType.fetchAccessTokenFailure
      payload: DiscordAuthActionPayload[DiscordAuthActionType.fetchAccessTokenFailure]
    }
