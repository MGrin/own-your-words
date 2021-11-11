import { State } from "../store";

export default (state: State) => state.owsn;

export const owsnTwitterSelector = (state: State) => ({
  loading: state.owsn.twitterLoading,
  error: state.owsn.twitterError,
  price: state.owsn.twitterPrice,
  available: state.owsn.twitterAccountAvailable,
});
