import type { Reducer } from 'react'
import type { ethers } from 'ethers'
import type { Web3Action, Web3ActionPayload } from '../actions/web3/types'
import { Web3ActionType } from '../actions/web3/types'

export type Web3State = {
  available: boolean
  connected: boolean
  address?: string
  sweetAddress?: string
  network?: ethers.providers.Network

  loading: boolean
  error?: Error
}

const initialState: Web3State = {
  available: true,
  connected: false,

  loading: true,
}

const reducer: Reducer<Web3State, Web3Action> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case Web3ActionType.changeLoading: {
      const payload =
        action.payload as Web3ActionPayload[Web3ActionType.changeLoading]
      return {
        ...state,
        loading: payload.loading,
      }
    }
    case Web3ActionType.changeAvailability: {
      const payload =
        action.payload as Web3ActionPayload[Web3ActionType.changeAvailability]
      return {
        ...state,
        available: payload.available,
      }
    }
    case Web3ActionType.connectStart: {
      return {
        ...state,
        loading: true,
      }
    }
    case Web3ActionType.connectSuccess: {
      const payload =
        action.payload as Web3ActionPayload[Web3ActionType.connectSuccess]
      return {
        ...state,
        loading: false,
        address: payload.address,
        sweetAddress: payload.sweetAddress,
        network: payload.network,
        connected: true,
      }
    }
    case Web3ActionType.connectFailure: {
      const payload =
        action.payload as Web3ActionPayload[Web3ActionType.connectFailure]
      return {
        ...state,
        loading: false,
        error: payload.error,
      }
    }
    default:
      return state
  }
}

export default reducer
