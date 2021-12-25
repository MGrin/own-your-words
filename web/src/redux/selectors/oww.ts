import { State } from '../store'

export const owwInputSelector = (state: State) => ({
  postUrl: state.oww.postUrl,
  isUrlValid: state.oww.isUrlValid,
  postId: state.oww.postId,
})

export const owwSelector = (state: State) => ({
  price: state.oww.price,
  tokenIds: state.oww.tokenIds,
  loading: state.oww.loading,
  error: state.oww.error,
})
