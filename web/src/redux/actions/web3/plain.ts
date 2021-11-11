import type { AC } from '../../utils'
import type { Web3ActionPayload } from './types'
import { Web3ActionType } from './types'

export const changeLoading: AC<
  Web3ActionType.changeLoading,
  Web3ActionPayload[Web3ActionType.changeLoading]
> = ({ loading }) => ({
  type: Web3ActionType.changeLoading,
  payload: {
    loading,
  },
})

export const changeAvailability: AC<
  Web3ActionType.changeAvailability,
  Web3ActionPayload[Web3ActionType.changeAvailability]
> = ({ available }) => ({
  type: Web3ActionType.changeAvailability,
  payload: {
    available,
  },
})

export const connectStart: AC<
  Web3ActionType.connectStart,
  Web3ActionPayload[Web3ActionType.connectStart]
> = () => ({
  type: Web3ActionType.connectStart,
  payload: undefined,
})

export const connectSuccess: AC<
  Web3ActionType.connectSuccess,
  Web3ActionPayload[Web3ActionType.connectSuccess]
> = (payload) => ({
  type: Web3ActionType.connectSuccess,
  payload,
})

export const connectFailure: AC<
  Web3ActionType.connectFailure,
  Web3ActionPayload[Web3ActionType.connectFailure]
> = (payload) => ({
  type: Web3ActionType.connectFailure,
  payload,
})
