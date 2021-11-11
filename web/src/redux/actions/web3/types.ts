import type { ethers } from 'ethers'

export enum Web3ActionType {
  changeLoading = 'WEB3/changeLoading',
  changeAvailability = 'WEB3/changeAvailability',
  connectStart = 'WEB3/connect_START',
  connectSuccess = 'WEB3/connect_SUCCESS',
  connectFailure = 'WEB3/connect_FAILURE',
}

export type Web3ActionPayload = {
  [Web3ActionType.changeLoading]: {
    loading: boolean
  }
  [Web3ActionType.changeAvailability]: {
    available: boolean
  }
  [Web3ActionType.connectStart]: void
  [Web3ActionType.connectSuccess]: {
    address: string
    sweetAddress: string
    network: ethers.providers.Network
  }
  [Web3ActionType.connectFailure]: {
    error: Error
  }
}

export type Web3Action =
  | {
      type: Web3ActionType.changeLoading
      payload: Web3ActionPayload[Web3ActionType.changeLoading]
    }
  | {
      type: Web3ActionType.changeAvailability
      payload: Web3ActionPayload[Web3ActionType.changeAvailability]
    }
  | {
      type: Web3ActionType.connectStart
      payload: Web3ActionPayload[Web3ActionType.connectStart]
    }
  | {
      type: Web3ActionType.connectSuccess
      payload: Web3ActionPayload[Web3ActionType.connectSuccess]
    }
  | {
      type: Web3ActionType.connectFailure
      payload: Web3ActionPayload[Web3ActionType.connectFailure]
    }
