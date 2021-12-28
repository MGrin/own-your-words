import discordAuthService from '../../../services/DiscordAuthService'
import ethersService from '../../../services/EthersService'
import { Logger } from '../../../services/Logger'
import twitterAuthService from '../../../services/TwitterAuthService'
import type { ThunkAC } from '../../utils'
import { connectStart, connectSuccess, connectFailure } from './plain'

const logger = new Logger('Web3AsyncActions')
const pageLoadedTimestamp = Date.now()
const modesClearingTimeout = 1000

export const connect: ThunkAC<void> = () => async (dispatch) => {
  dispatch(connectStart())
  try {
    const previousAddress = ethersService.address
    const previousNetwork = ethersService.network

    await ethersService.connect()

    logger.log(
      `Previous address: ${previousAddress}, Current address: ${ethersService.address}`
    )
    logger.log(
      `Previous network: ${previousNetwork?.name}, Current network: ${ethersService.network?.name}`
    )

    if (
      (ethersService.network?.name !== previousNetwork?.name ||
        ethersService.address === previousAddress) &&
      Date.now() - pageLoadedTimestamp > modesClearingTimeout
    ) {
      twitterAuthService.setMode()
      discordAuthService.setMode()
    }

    dispatch(
      connectSuccess({
        address: ethersService.address!,
        network: ethersService.network!,
        sweetAddress: ethersService.sweetAddress!,
      })
    )
  } catch (error) {
    logger.error(error as Error)
    dispatch(connectFailure({ error: error as Error }))
  }
}
