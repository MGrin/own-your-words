import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import logger from 'redux-logger'

import type { TwitterAuthAction } from './actions/twitterAuth/types'
import type { Web3Action } from './actions/web3/types'
import * as reducers from './reducers'
import type { TwitterAuthState } from './reducers/twitterAuth'
import type { Web3State } from './reducers/web3'
import type { ThunkAction } from './utils'
import type { OWSNAction } from './actions/owsn/types'
import type { OWSNState } from './reducers/owsn'
import twitterRedirectCatcher from './middlewares/twitterRedirectCatcher'
import { OWWState } from './reducers/oww'
import { OWWAction } from './actions/oww/types'

export type State = {
  web3: Web3State
  twitterAuth: TwitterAuthState
  owsn: OWSNState
  oww: OWWState
}

export type PlainAction =
  | Web3Action
  | TwitterAuthAction
  | OWSNAction
  | OWWAction
export type Action = PlainAction | ThunkAction

// @ts-expect-error
const store = createStore<State, Action, any, any>(
  combineReducers(reducers),
  applyMiddleware(thunk, twitterRedirectCatcher, logger)
)

export default store
