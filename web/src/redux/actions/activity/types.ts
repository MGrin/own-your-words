import { Request } from '../../reducers/activity'

export enum ActivityActionType {
  getRequestsStart = 'OWSN/getRequests/START',
  getRequestsSuccess = 'OWSN/getRequests/SUCCESS',
  getRequestsFailure = 'OWSN/getRequests/FAILURE',
}

export type ActivityActionPayload = {
  [ActivityActionType.getRequestsStart]: void
  [ActivityActionType.getRequestsSuccess]: {
    requests: Request[]
  }
  [ActivityActionType.getRequestsFailure]: {
    error: Error
  }
}

export type ActivityAction =
  | {
      type: ActivityActionType.getRequestsStart
      payload: ActivityActionPayload[ActivityActionType.getRequestsStart]
    }
  | {
      type: ActivityActionType.getRequestsSuccess
      payload: ActivityActionPayload[ActivityActionType.getRequestsSuccess]
    }
  | {
      type: ActivityActionType.getRequestsFailure
      payload: ActivityActionPayload[ActivityActionType.getRequestsFailure]
    }
