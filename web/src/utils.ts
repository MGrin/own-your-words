import {
  API_URL_HOMESTEAD,
  API_URL_LOCALHOST,
  API_URL_RINKEBY,
} from './constants'
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
    case 'homestead': {
      return API_URL_HOMESTEAD
    }
    default: {
      throw new Error(`No contract deployed to ${network} network`)
    }
  }
}

const VM_ERROR_EXCEPTION_PREFIX =
  "Error: VM Exception while processing transaction: reverted with reason string '"

export const formatError = (error: Error) => {
  if (!error) {
    return ''
  }
  // @ts-expect-error
  const data = error.data
  if (data && data.message) {
    if (data.message.indexOf(VM_ERROR_EXCEPTION_PREFIX) === 0) {
      const msg = data.message.substring(VM_ERROR_EXCEPTION_PREFIX.length)
      return msg.substring(0, msg.length - 1)
    }
    return data.message
  }
  return error.message
}
