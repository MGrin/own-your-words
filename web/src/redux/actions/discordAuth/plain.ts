import type { AC } from '../../utils'
import type { DiscordAuthActionPayload } from './types'
import { DiscordAuthActionType } from './types'

export const getRequestToken: AC<
  DiscordAuthActionType.getRequestToken,
  DiscordAuthActionPayload[DiscordAuthActionType.getRequestToken]
> = (payload) => ({
  type: DiscordAuthActionType.getRequestToken,
  payload,
})

export const readRequestTokenSuccess: AC<
  DiscordAuthActionType.readRequestTokenSuccess,
  DiscordAuthActionPayload[DiscordAuthActionType.readRequestTokenSuccess]
> = (payload) => ({
  type: DiscordAuthActionType.readRequestTokenSuccess,
  payload,
})

export const readRequestTokenFailure: AC<
  DiscordAuthActionType.readRequestTokenFailure,
  DiscordAuthActionPayload[DiscordAuthActionType.readRequestTokenFailure]
> = (payload) => ({
  type: DiscordAuthActionType.readRequestTokenFailure,
  payload,
})

export const fetchAccessTokenStart: AC<
  DiscordAuthActionType.fetchAccessTokenStart,
  DiscordAuthActionPayload[DiscordAuthActionType.fetchAccessTokenStart]
> = (payload) => ({
  type: DiscordAuthActionType.fetchAccessTokenStart,
  payload,
})

export const fetchAccessTokenSuccess: AC<
  DiscordAuthActionType.fetchAccessTokenSuccess,
  DiscordAuthActionPayload[DiscordAuthActionType.fetchAccessTokenSuccess]
> = (payload) => ({
  type: DiscordAuthActionType.fetchAccessTokenSuccess,
  payload,
})

export const fetchAccessTokenFailure: AC<
  DiscordAuthActionType.fetchAccessTokenFailure,
  DiscordAuthActionPayload[DiscordAuthActionType.fetchAccessTokenFailure]
> = (payload) => ({
  type: DiscordAuthActionType.fetchAccessTokenFailure,
  payload,
})
