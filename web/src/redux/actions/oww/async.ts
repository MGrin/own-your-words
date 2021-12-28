import {
  getPostPriceFailure,
  getPostPriceStart,
  getPostPriceSuccess,
  getTokenIdsFailure,
  getTokenIdsStart,
  getTokenIdsSuccess,
  mintPostFailure,
  mintPostStart,
} from '.'
import ethersService from '../../../services/EthersService'
import { Logger } from '../../../services/Logger'
import TwitterService from '../../../services/TwitterService'
import { ThunkAC } from '../../utils'
import { OWWActionPayload, OWWActionType } from './types'

const logger = new Logger('OWWAsyncActions')

export const getTokenIds: ThunkAC<
  OWWActionPayload[OWWActionType.getTokenIdsStart]
> = () => async (dispatch) => {
  dispatch(getTokenIdsStart())
  try {
    const oww = ethersService.getOWW()
    if (!oww) {
      throw new Error('OWW contract is not yet ready!')
    }
    if (!ethersService.address) {
      throw new Error('Account is not yet connected!')
    }

    const tokenIds = await oww.getOWWTokens(ethersService.address)
    dispatch(getTokenIdsSuccess({ tokenIds }))
  } catch (error) {
    logger.error(error as Error)
    dispatch(getTokenIdsFailure({ error: error as Error }))
  }
}

export const getPostPrice: ThunkAC<
  OWWActionPayload[OWWActionType.getPostPriceStart]
> = () => async (dispatch) => {
  dispatch(getPostPriceStart())
  try {
    const tpm = ethersService.getTPM()
    if (!tpm) {
      throw new Error('TPM contract is not yet ready!')
    }

    const price = await tpm.getPrice()
    dispatch(getPostPriceSuccess({ price }))
  } catch (error) {
    logger.error(error as Error)
    dispatch(getPostPriceFailure({ error: error as Error }))
  }
}

export const mintPost: ThunkAC<OWWActionPayload[OWWActionType.mintPostStart]> =
  ({ snName, postId }) =>
  async (dispatch) => {
    dispatch(mintPostStart({ snName, postId }))
    try {
      const oww = ethersService.getOWW()
      if (!oww) {
        throw new Error('OWW contract is not yet ready!')
      }

      const owsn = ethersService.getOWSN()
      if (!owsn) {
        throw new Error('owsn contract is not yet ready!')
      }

      const tpm = ethersService.getTPM()
      if (!tpm) {
        throw new Error('TPM contract is not yet ready!')
      }

      const price = await tpm.getPrice()

      const available = await oww.isAvailable(snName, postId)

      if (!available) {
        throw new Error('Unfortunately, this post is not available for minting')
      }

      switch (snName) {
        case 'twitter': {
          const post = await TwitterService.getPostById(postId)

          const owsnToken = await owsn.getOWSNBySnId(
            snName,
            String(post.user.id)
          )

          const owsnOwner = await owsn.ownerOf(owsnToken.id)

          if (
            owsnOwner.toLowerCase() !==
            ethersService.address?.toLocaleLowerCase()
          ) {
            throw new Error(
              'Requesting account is not an owner of social network'
            )
          }
          await oww.mintTwitterOWW(postId, price)
          return
        }
        default: {
          throw new Error(`Unsupported social network: ${snName}`)
        }
      }
    } catch (error) {
      logger.error(error as Error)
      dispatch(mintPostFailure({ error: error as Error }))
    }
  }
