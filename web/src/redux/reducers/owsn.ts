import type { Reducer } from 'react'
import type { OWSNAction, OWSNActionPayload } from '../actions/owsn/types'
import { OWSNActionType } from '../actions/owsn/types'

export type OWSNTwitterState = {
  twitterPrice: string
  twitterAccountAvailable?: boolean
  twitterLoading?: boolean
  twitterError?: Error
}

export type OWSNDiscordState = {
  discordPrice: string
  discordAccountAvailable?: boolean
  discordLoading?: boolean
  discordError?: Error
}

export type OWSNState = {
  tokenIds: number[]
  loading?: boolean
  error?: Error
} & OWSNTwitterState &
  OWSNDiscordState

const twitterInitialState: OWSNTwitterState = {
  twitterPrice: '0.05',
}

const discordInitialState: OWSNDiscordState = {
  discordPrice: '0.05',
}

const initialState: OWSNState = {
  tokenIds: [],
  ...twitterInitialState,
  ...discordInitialState,
}

const reducer: Reducer<OWSNState, OWSNAction> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case OWSNActionType.getTwitterPriceStart: {
      return {
        ...state,
        twitterError: undefined,
      }
    }
    case OWSNActionType.getTwitterPriceSuccess: {
      const payload =
        action.payload as OWSNActionPayload[OWSNActionType.getTwitterPriceSuccess]
      return {
        ...state,
        twitterError: undefined,
        twitterPrice: payload.price,
      }
    }
    case OWSNActionType.getTwitterPriceFailure: {
      const payload =
        action.payload as OWSNActionPayload[OWSNActionType.getTwitterPriceFailure]
      return {
        ...state,
        twitterError: payload.error,
      }
    }

    case OWSNActionType.getDiscordPriceStart: {
      return {
        ...state,
        discordError: undefined,
      }
    }
    case OWSNActionType.getDiscordPriceSuccess: {
      const payload =
        action.payload as OWSNActionPayload[OWSNActionType.getDiscordPriceSuccess]
      return {
        ...state,
        discordError: undefined,
        discordPrice: payload.price,
      }
    }
    case OWSNActionType.getDiscordPriceFailure: {
      const payload =
        action.payload as OWSNActionPayload[OWSNActionType.getDiscordPriceFailure]
      return {
        ...state,
        discordError: payload.error,
      }
    }

    case OWSNActionType.getTokenIdsStart: {
      return {
        ...state,
        loading: true,
        error: undefined,
        tokenIds: [],
      }
    }
    case OWSNActionType.getTokenIdsSuccess: {
      const payload =
        action.payload as OWSNActionPayload[OWSNActionType.getTokenIdsSuccess]
      return {
        ...state,
        loading: false,
        error: undefined,
        tokenIds: payload.tokenIds,
      }
    }
    case OWSNActionType.getTokenIdsFailure: {
      const payload =
        action.payload as OWSNActionPayload[OWSNActionType.getTokenIdsFailure]
      return {
        ...state,
        loading: false,
        tokenIds: [],
        error: payload.error,
      }
    }

    case OWSNActionType.checkAccountAvailabilityStart: {
      const newState = {
        ...state,
      }

      const payload =
        action.payload as OWSNActionPayload[OWSNActionType.checkAccountAvailabilityStart]
      switch (payload.snName) {
        case 'twitter': {
          newState.twitterLoading = true
          newState.twitterError = undefined
          break
        }
        case 'discord': {
          newState.discordLoading = true
          newState.discordError = undefined
          break
        }
      }

      return newState
    }

    case OWSNActionType.checkAccountAvailabilitySuccess: {
      const newState = {
        ...state,
      }

      const payload =
        action.payload as OWSNActionPayload[OWSNActionType.checkAccountAvailabilitySuccess]

      switch (payload.snName) {
        case 'twitter': {
          newState.twitterLoading = false
          newState.twitterError = undefined
          newState.twitterAccountAvailable = payload.available
          break
        }
        case 'discord': {
          newState.discordLoading = false
          newState.discordError = undefined
          newState.discordAccountAvailable = payload.available
          break
        }
      }
      return newState
    }

    case OWSNActionType.checkAccountAvailabilityFailure: {
      const newState = {
        ...state,
      }

      const payload =
        action.payload as OWSNActionPayload[OWSNActionType.checkAccountAvailabilityFailure]

      switch (payload.snName) {
        case 'twitter': {
          newState.twitterLoading = false
          newState.twitterError = payload.error
          newState.twitterAccountAvailable = false
          break
        }
        case 'discord': {
          newState.discordLoading = false
          newState.discordError = payload.error
          newState.discordAccountAvailable = false
          break
        }
      }
      return newState
    }

    case OWSNActionType.mintTwitterStart: {
      return {
        ...state,
        twitterLoading: true,
        twitterError: undefined,
      }
    }

    case OWSNActionType.mintTwitterSuccess: {
      const payload =
        action.payload as OWSNActionPayload[OWSNActionType.mintTwitterSuccess]
      return {
        ...state,
        twitterLoading: false,
        twitterError: undefined,
        tokenIds: [...state.tokenIds, Number(payload.tokenId)],
      }
    }
    case OWSNActionType.mintTwitterFailure: {
      const payload =
        action.payload as OWSNActionPayload[OWSNActionType.mintTwitterFailure]
      return {
        ...state,
        twitterLoading: false,
        twitterError: payload.error,
      }
    }

    case OWSNActionType.mintDiscordStart: {
      return {
        ...state,
        discordLoading: true,
        discordError: undefined,
      }
    }

    case OWSNActionType.mintDiscordSuccess: {
      const payload =
        action.payload as OWSNActionPayload[OWSNActionType.mintDiscordSuccess]
      return {
        ...state,
        discordLoading: false,
        discordError: undefined,
        tokenIds: [...state.tokenIds, Number(payload.tokenId)],
      }
    }
    case OWSNActionType.mintDiscordFailure: {
      const payload =
        action.payload as OWSNActionPayload[OWSNActionType.mintDiscordFailure]
      return {
        ...state,
        discordLoading: false,
        discordError: payload.error,
      }
    }

    default: {
      return state
    }
  }
}

export default reducer
