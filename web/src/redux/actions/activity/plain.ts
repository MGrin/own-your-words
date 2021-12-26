import { AC } from '../../utils'
import { ActivityActionPayload, ActivityActionType } from './types'

export const getRequestsStart: AC<
  ActivityActionType.getRequestsStart,
  ActivityActionPayload[ActivityActionType.getRequestsStart]
> = () => ({
  type: ActivityActionType.getRequestsStart,
  payload: undefined,
})

export const getRequestsSuccess: AC<
  ActivityActionType.getRequestsSuccess,
  ActivityActionPayload[ActivityActionType.getRequestsSuccess]
> = ({ requests }) => ({
  type: ActivityActionType.getRequestsSuccess,
  payload: {
    requests,
  },
})

export const getRequestsFailure: AC<
  ActivityActionType.getRequestsFailure,
  ActivityActionPayload[ActivityActionType.getRequestsFailure]
> = ({ error }) => ({
  type: ActivityActionType.getRequestsFailure,
  payload: {
    error,
  },
})
