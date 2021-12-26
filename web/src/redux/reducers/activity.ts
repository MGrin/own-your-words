import { Reducer } from 'redux'
import { AvailableContracts } from '../../services/EthersService'
import { ActivityAction, ActivityActionType } from '../actions/activity/types'

export type Request = {
  id: number
  status: number
  error: Error
  targetContract: AvailableContracts
  history?: Request[]
}

export type ActivityState = {
  loading?: boolean
  error?: Error
  requests: Request[]
}

const intialState: ActivityState = {
  requests: [],
}

const reducer: Reducer<ActivityState, ActivityAction> = (
  state = intialState,
  action
) => {
  switch (action.type) {
    case ActivityActionType.getRequestsStart: {
      return {
        ...state,
        loading: true,
        error: undefined,
      }
    }
    case ActivityActionType.getRequestsSuccess: {
      return {
        ...state,
        loading: false,
        error: undefined,
        requests: action.payload.requests,
      }
    }
    case ActivityActionType.getRequestsFailure: {
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      }
    }
    default: {
      return state
    }
  }
}

export default reducer
