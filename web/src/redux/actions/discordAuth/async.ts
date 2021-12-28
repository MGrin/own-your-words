import { readRequestTokenFailure } from '.'
import { Logger } from '../../../services/Logger'
import discordAuthService from '../../../services/DiscordAuthService'
import type { ThunkAC } from '../../utils'
import { checkAccountAvailability } from '../owsn'
import {
  fetchAccessTokenStart,
  fetchAccessTokenSuccess,
  fetchAccessTokenFailure,
  getRequestToken,
} from './plain'
import type { DiscordAuthActionPayload, DiscordAuthActionType } from './types'

const logger = new Logger('DiscordAuthAsyncActions')

export const fetchRequestToken: ThunkAC<
  DiscordAuthActionPayload[DiscordAuthActionType.getRequestToken]
> =
  ({ callbackUrl }) =>
  async (dispatch) => {
    dispatch(getRequestToken({ callbackUrl }))
    try {
      const authUrl = await discordAuthService.getAuthUrl(callbackUrl)
      window.location.href = authUrl
    } catch (error) {
      logger.error(error as Error)
      dispatch(readRequestTokenFailure({ error: error as Error }))
    }
  }

export const fetchAccessToken: ThunkAC<void> = () => async (dispatch) => {
  dispatch(fetchAccessTokenStart())
  const next = async () => {
    try {
      const accessToken = await discordAuthService.getAccessToken()
      dispatch(fetchAccessTokenSuccess(accessToken))

      const user = await discordAuthService.getUser(accessToken)
      dispatch(
        // @ts-expect-error
        checkAccountAvailability({
          snName: 'discord',
          snId: user.id,
        })
      )
    } catch (error) {
      logger.error(error as Error)
      dispatch(fetchAccessTokenFailure({ error: error as Error }))
    }
  }

  if (discordAuthService) {
    next()
    return
  }

  setTimeout(next, 1)
}
