import { API_URL_LOCALHOST, API_URL_RINKEBY } from './constants'
import ethersService from './services/EthersService'

export const getApiUrl = () => {
  const network = ethersService.network?.name

  switch (network) {
    case 'localhost': {
      return API_URL_LOCALHOST
    }
    case 'rinkeby': {
      return API_URL_RINKEBY
    }
    default: {
      throw new Error(`No contract deployed to ${network} network`)
    }
  }
}
