import {
  checkAccountAvailabilityFailure,
  checkAccountAvailabilityStart,
  checkAccountAvailabilitySuccess,
  getTokenIdsFailure,
  getTokenIdsStart,
  getTokenIdsSuccess,
  getTwitterPriceFailure,
  getTwitterPriceStart,
  getTwitterPriceSuccess,
  mintTwitterFailure,
  mintTwitterStart,
} from '.'
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

      await owsn.getOwnedAccountByGenSnId(owsn.getGenId(snName, snId))
      dispatch(checkAccountAvailabilitySuccess({ snName, available: false }))
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
