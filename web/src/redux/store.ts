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
import redirectCatcher from './middlewares/redirectCatcher'
import { OWWState } from './reducers/oww'
import { OWWAction } from './actions/oww/types'
import { ActivityState } from './reducers/activity'
import { ActivityAction } from './actions/activity/types'
import { DiscordAuthState } from './reducers/discordAuth'
import { DiscordAuthAction } from './actions/discordAuth/types'

export type State = {
  web3: Web3State
  twitterAuth: TwitterAuthState
  discordAuth: DiscordAuthState
  owsn: OWSNState
  oww: OWWState
  activity: ActivityState
}

export type PlainAction =
  | Web3Action
  | TwitterAuthAction
  | OWSNAction
  | OWWAction
  | ActivityAction
  | DiscordAuthAction

export type Action = PlainAction | ThunkAction

const middlewares = [thunk, redirectCatcher]
if (process.env.NODE_ENV !== 'production') {
  // @ts-expect-error
  middlewares.push(logger)
}
// @ts-expect-error
const store = createStore<State, Action, any, any>(
  combineReducers(reducers),
  applyMiddleware(...middlewares)
)

export default store
