import { State } from '../store'

export const activityRequestsSelector = (state: State) => ({
  requests: state.activity.requests,
  error: state.activity.error,
  loading: state.activity.loading,
})
