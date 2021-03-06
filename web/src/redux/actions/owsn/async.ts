import {
  checkAccountAvailabilityFailure,
  checkAccountAvailabilityStart,
  checkAccountAvailabilitySuccess,
  getDiscordPriceFailure,
  getDiscordPriceStart,
  getDiscordPriceSuccess,
  getTokenIdsFailure,
  getTokenIdsStart,
  getTokenIdsSuccess,
  getTwitterPriceFailure,
  getTwitterPriceStart,
  getTwitterPriceSuccess,
  mintDiscordFailure,
  mintDiscordStart,
  mintTwitterFailure,
  mintTwitterStart,
} from '.'
import discordAuthService from '../../../services/DiscordAuthService'
import ethersService from '../../../services/EthersService'
import { Logger } from '../../../services/Logger'
import twitterAuthService from '../../../services/TwitterAuthService'
import type { ThunkAC } from '../../utils'
import type { OWSNActionPayload, OWSNActionType } from './types'

const logger = new Logger('OWSNAsyncActions')

export const checkAccountAvailability: ThunkAC<
  OWSNActionPayload[OWSNActionType.checkAccountAvailabilityStart]
> =
  ({ snName, snId }) =>
  async (dispatch) => {
    dispatch(checkAccountAvailabilityStart({ snName, snId }))
    try {
      const owsn = ethersService.getOWSN()
      if (!owsn) {
        const error = new Error('OWSN contract is not yet ready!')
        logger.error(error as Error)
        dispatch(
          checkAccountAvailabilityFailure({ snName, error: error as Error })
        )
        return
      }

      const available = await owsn.isAvailable(snName, snId)
      dispatch(checkAccountAvailabilitySuccess({ snName, available }))
    } catch (error) {
      logger.error(error as Error)
      dispatch(checkAccountAvailabilitySuccess({ snName, available: true }))
    }
  }

export const getTokenIds: ThunkAC<
  OWSNActionPayload[OWSNActionType.getTokenIdsStart]
> = () => async (dispatch) => {
  dispatch(getTokenIdsStart())
  try {
    const owsn = ethersService.getOWSN()
    if (!owsn) {
      throw new Error('OWSN contract is not yet ready!')
    }
    if (!ethersService.address) {
      throw new Error('Account is not yet connected!')
    }

    const tokenIds = await owsn.getOwnedAccountTokens(ethersService.address)
    dispatch(getTokenIdsSuccess({ tokenIds }))
  } catch (error) {
    logger.error(error as Error)
    dispatch(getTokenIdsFailure({ error: error as Error }))
  }
}

export const getTwitterPrice: ThunkAC<
  OWSNActionPayload[OWSNActionType.getTwitterPriceStart]
> = () => async (dispatch) => {
  dispatch(getTwitterPriceStart())
  try {
    const tm = ethersService.getTM()
    if (!tm) {
      throw new Error('TM contract is not yet ready!')
    }

    const price = await tm.getPrice()
    dispatch(getTwitterPriceSuccess({ price }))
  } catch (error) {
    logger.error(error as Error)
    dispatch(getTwitterPriceFailure({ error: error as Error }))
  }
}

export const getDiscordPrice: ThunkAC<
  OWSNActionPayload[OWSNActionType.getDiscordPriceStart]
> = () => async (dispatch) => {
  dispatch(getDiscordPriceStart())
  try {
    const dm = ethersService.getDM()
    if (!dm) {
      throw new Error('TM contract is not yet ready!')
    }

    const price = await dm.getPrice()
    dispatch(getDiscordPriceSuccess({ price }))
  } catch (error) {
    logger.error(error as Error)
    dispatch(getDiscordPriceFailure({ error: error as Error }))
  }
}

export const mintTwitter: ThunkAC<
  OWSNActionPayload[OWSNActionType.mintTwitterStart]
> =
  ({ oauthToken, oauthVerifier }) =>
  async (dispatch) => {
    dispatch(mintTwitterStart({ oauthToken, oauthVerifier }))
    try {
      const owsn = ethersService.getOWSN()
      if (!owsn) {
        throw new Error('OWSN contract is not yet ready!')
      }

      const tm = ethersService.getTM()
      if (!tm) {
        throw new Error('TM contract is not yet ready!')
      }

      const price = await tm.getPrice()
      const {
        oauthToken: oauthTokenEncrypted,
        oauthVerifier: oauthVerifierEncrypted,
      } = await twitterAuthService.encryptOAuthTokenAndVerifier(
        oauthToken,
        oauthVerifier
      )

      await owsn.mintTwitterOWSN(
        oauthTokenEncrypted,
        oauthVerifierEncrypted,
        price
      )
    } catch (error) {
      logger.error(error as Error)
      dispatch(mintTwitterFailure({ error: error as Error }))
    }
  }

export const mintDiscord: ThunkAC<
  OWSNActionPayload[OWSNActionType.mintDiscordStart]
> =
  ({ code, redirectUrl }) =>
  async (dispatch) => {
    dispatch(mintDiscordStart({ code, redirectUrl }))
    try {
      const owsn = ethersService.getOWSN()
      if (!owsn) {
        throw new Error('OWSN contract is not yet ready!')
      }

      const dm = ethersService.getDM()
      if (!dm) {
        throw new Error('DM contract is not yet ready!')
      }

      const price = await dm.getPrice()
      const { code: codeEncrypted, redirectUrl: redirectUrlEncrypted } =
        await discordAuthService.encryptOAuthCodeAndRedirectUrl(
          code,
          redirectUrl
        )

      await owsn.mintDiscordOWSN(codeEncrypted, redirectUrlEncrypted, price)
    } catch (error) {
      logger.error(error as Error)
      dispatch(mintDiscordFailure({ error: error as Error }))
    }
  }
