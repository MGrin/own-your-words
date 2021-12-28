import discordAuthService from '../../services/DiscordAuthService'
import twitterAuthService, { MODE } from '../../services/TwitterAuthService'
import { mintDiscord, mintTwitter } from '../actions/owsn'
import { fetchAccessToken as fetchTwitterAccessToken } from '../actions/twitterAuth'
import { fetchAccessToken as fetchDiscordAccessToken } from '../actions/discordAuth'
import { Web3ActionType } from '../actions/web3/types'
import type { PlainAction } from '../store'
import type { StoreAPI } from '../utils'
import { Logger } from '../../services/Logger'

const logger = new Logger('RedirectCatcher')

type NextFn = (a: PlainAction) => void
const catcher =
  (store: StoreAPI) => (next: NextFn) => (action: PlainAction) => {
    next(action)

    setTimeout(() => {
      if (action.type !== Web3ActionType.connectSuccess) {
        return
      }

      let redirectOrigin
      if (twitterAuthService.mode) {
        redirectOrigin = 'twitter'
      } else if (discordAuthService.mode) {
        redirectOrigin = 'discord'
      }

      logger.log(`Redirect origin = ${redirectOrigin}`)

      if (!redirectOrigin) {
        return
      }

      let checkProcessing
      let mintProcessing
      let mode: MODE | null = null

      switch (redirectOrigin) {
        case 'twitter': {
          mode = twitterAuthService.mode
          checkProcessing = () => {
            store.dispatch(fetchTwitterAccessToken())
          }
          mintProcessing = () => {
            if (
              !twitterAuthService.oauthToken ||
              !twitterAuthService.oauthVerifier
            ) {
              return
            }

            store.dispatch(
              mintTwitter({
                oauthToken: twitterAuthService.oauthToken!,
                oauthVerifier: twitterAuthService.oauthVerifier!,
              })
            )
          }
          break
        }
        case 'discord': {
          mode = discordAuthService.mode
          checkProcessing = () => {
            store.dispatch(fetchDiscordAccessToken())
          }
          mintProcessing = () => {
            if (!discordAuthService.code) {
              return
            }

            store.dispatch(
              mintDiscord({
                code: discordAuthService.code!,
                redirectUrl: discordAuthService.getRedirectUrl(),
              })
            )
          }
          break
        }
      }

      if (!mode || !checkProcessing || !mintProcessing) {
        return
      }

      switch (mode) {
        case MODE.check: {
          checkProcessing()
          return
        }
        case MODE.mint: {
          mintProcessing()
        }
      }
    }, 500)
  }

export default catcher
