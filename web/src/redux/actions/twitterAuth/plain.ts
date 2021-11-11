import type { AC } from '../../utils'
import type { TwitterAuthActionPayload } from './types'
import { TwitterAuthActionType } from './types'

export const getRequestToken: AC<
  TwitterAuthActionType.getRequestToken,
  TwitterAuthActionPayload[TwitterAuthActionType.getRequestToken]
> = (payload) => ({
  type: TwitterAuthActionType.getRequestToken,
  payload,
})

export const readRequestTokenSuccess: AC<
  TwitterAuthActionType.readRequestTokenSuccess,
  TwitterAuthActionPayload[TwitterAuthActionType.readRequestTokenSuccess]
> = (payload) => ({
  type: TwitterAuthActionType.readRequestTokenSuccess,
  payload,
})

export const readRequestTokenFailure: AC<
  TwitterAuthActionType.readRequestTokenFailure,
  TwitterAuthActionPayload[TwitterAuthActionType.readRequestTokenFailure]
> = (payload) => ({
  type: TwitterAuthActionType.readRequestTokenFailure,
  payload,
})

export const fetchAccessTokenStart: AC<
  TwitterAuthActionType.fetchAccessTokenStart,
  TwitterAuthActionPayload[TwitterAuthActionType.fetchAccessTokenStart]
> = (payload) => ({
  type: TwitterAuthActionType.fetchAccessTokenStart,
  payload,
})

export const fetchAccessTokenSuccess: AC<
  TwitterAuthActionType.fetchAccessTokenSuccess,
  TwitterAuthActionPayload[TwitterAuthActionType.fetchAccessTokenSuccess]
> = (payload) => ({
  type: TwitterAuthActionType.fetchAccessTokenSuccess,
  payload,
})

export const fetchAccessTokenFailure: AC<
  TwitterAuthActionType.fetchAccessTokenFailure,
  TwitterAuthActionPayload[TwitterAuthActionType.fetchAccessTokenFailure]
> = (payload) => ({
  type: TwitterAuthActionType.fetchAccessTokenFailure,
  payload,
})
