import type { Reducer } from 'react'
import {
  DiscordAuthAction,
  DiscordAuthActionPayload,
  DiscordAuthActionType,
} from '../actions/discordAuth/types'

export type DiscordAuthState = {
  loading?: boolean
  error?: Error
}

const initialState: DiscordAuthState = {
  loading: false,
}

const reducer: Reducer<DiscordAuthState, DiscordAuthAction> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case DiscordAuthActionType.getRequestToken: {
      return {
        ...state,
        error: undefined,
        loading: true,
      }
    }
    case DiscordAuthActionType.readRequestTokenFailure: {
      const payload =
        action.payload as DiscordAuthActionPayload[DiscordAuthActionType.readRequestTokenFailure]
      return {
        ...state,
        loading: false,
        error: payload.error,
      }
    }

    case DiscordAuthActionType.readRequestTokenSuccess: {
      return {
        ...state,
        loading: false,
        error: undefined,
      }
    }

    case DiscordAuthActionType.fetchAccessTokenStart: {
      return {
        ...state,
        error: undefined,
        loading: true,
      }
    }

    case DiscordAuthActionType.fetchAccessTokenFailure: {
      const payload =
        action.payload as DiscordAuthActionPayload[DiscordAuthActionType.fetchAccessTokenFailure]
      return {
        ...state,
        loading: false,
        error: payload.error,
      }
    }

    case DiscordAuthActionType.fetchAccessTokenSuccess: {
      return {
        ...state,
        loading: false,
        error: undefined,
      }
    }

    default: {
      return state
    }
  }
}

export default reducer
