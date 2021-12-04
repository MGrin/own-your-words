import type { State } from '../store'

const selector = (state: State) => state.owsn
export default selector

export const owsnTwitterSelector = (state: State) => ({
  loading: state.owsn.twitterLoading,
  error: state.owsn.twitterError,
  price: state.owsn.twitterPrice,
  available: state.owsn.twitterAccountAvailable,
})

export const tokenIdsSelector = (state: State) => {
  return state.owsn.tokenIds
}
