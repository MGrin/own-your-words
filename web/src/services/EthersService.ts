import { ethers } from 'ethers'
import { OWSN_CONTRACT_LOCALHOST, OWSN_CONTRACT_RINKEBY } from '../constants'
import { Logger } from './Logger'
import { OWSNService } from './OWSNService'
import OWSN from '../abi/OwnYourSocialNetwork.json'
import TM from '../abi/TwitterMinter.json'

import { TMService } from './TMService'
import store from '../redux/store'
import { changeAvailability } from '../redux/actions/web3'

export enum SupportedNetworks {
  localhost = 'localhost',
  rinkeby = 'rinkeby',
}

export enum AvailableContracts {
  owsn = 'OWSN',
  tm = 'TM',
}

export const getSweetAddress = (address: string) =>
  `${address.slice(0, 6)}...${address.slice(
    address.length - 4,
    address.length
  )}`

export const getOWSNContractAddress = (network: SupportedNetworks) => {
  console.log(network)
  switch (network) {
    case SupportedNetworks.localhost:
      return OWSN_CONTRACT_LOCALHOST
    case SupportedNetworks.rinkeby:
      return OWSN_CONTRACT_RINKEBY
    default:
      throw new Error('UNKNOWN NETWORK')
  }
}

class EthersService {
  private readonly logger = new Logger('EthersService')

  public available: boolean = true

  public connected: boolean = false

  public address?: string

  public sweetAddress?: string

  public network?: ethers.providers.Network

  public contractServices?: {
    [AvailableContracts.owsn]?: OWSNService
    [AvailableContracts.tm]?: TMService
  }

  private provider?: ethers.providers.Web3Provider

  private account?: ethers.Signer

  public autoConnect: boolean = localStorage.getItem('autoconnect') === 'true'

  constructor() {
    this.logger.log('Constructor')

    // @ts-expect-error
    if (!window.ethereum) {
      this.available = false
      store.dispatch(changeAvailability({ available: false }))
      return
    }

    this.provider = new ethers.providers.Web3Provider(
      // @ts-expect-error
      window.ethereum || 'http://localhost:8545',
      'any'
    )
  }

  public async connect() {
    this.logger.log('Connect')

    if (!this.provider) {
      throw new Error('Web3 / Etherium is not availabel in your browser.')
    }

    try {
      await this.provider.send('eth_requestAccounts', [])
    } catch (error) {
      localStorage.removeItem('autoconnect')
      throw error
    }

    this.account = this.provider.getSigner()
    this.address = await this.account.getAddress()

    try {
      const ens = await this.provider.lookupAddress(this.address)
      if (ens) {
        this.sweetAddress = ens
      } else {
        this.sweetAddress = getSweetAddress(this.address)
      }
    } catch (err) {
      this.sweetAddress = getSweetAddress(this.address)
    }

    this.network = await this.provider.getNetwork()
    if (this.network.name === 'unknown') {
      this.network.name = 'localhost'
    }

    this.connected = true

    let owsn
    let tm

    this.contractServices = {}

    try {
      owsn = new OWSNService(
        await this.loadContract(AvailableContracts.owsn, OWSN.abi, [
          'mintTwitter',
        ])
      )

      this.contractServices[AvailableContracts.owsn] = owsn

      tm = new TMService(
        await this.loadContract(AvailableContracts.tm, TM.abi),
        this.address
      )

      this.contractServices[AvailableContracts.tm] = tm

      localStorage.setItem('autoconnect', 'true')
    } catch (err) {
      this.logger.error(err as Error)
    }
  }

  public getOWSN() {
    return this.contractServices
      ? this.contractServices[AvailableContracts.owsn]
      : undefined
  }

  public getTM() {
    return this.contractServices
      ? this.contractServices[AvailableContracts.tm]
      : undefined
  }

  private async loadContract(
    symbol: AvailableContracts,
    abi: any,
    mayFailOverrides: string[] = []
  ) {
    this.logger.log(
      `Load Contract [symbol=${symbol}][mayFailOverrides=${mayFailOverrides.join(
        ', '
      )}]`
    )

    if (!this.account || !this.network) {
      throw new Error('Signer is not connected yet')
    }

    let address: string
    switch (symbol) {
      case AvailableContracts.owsn: {
        address = getOWSNContractAddress(this.network.name as SupportedNetworks)

        break
      }
      case AvailableContracts.tm: {
        if (
          !this.contractServices ||
          !this.contractServices[AvailableContracts.owsn]
        ) {
          throw new Error('OWSN Contract was not yet loaded.')
        }

        address =
          (await this.contractServices[
            AvailableContracts.owsn
          ]!.getTMAddress()) || ''

        break
      }
    }

    const contract = new ethers.Contract(address, abi, this.provider).connect(
      this.account
    )

    // @ts-expect-error
    contract.safeCall = {}
    mayFailOverrides.forEach((method) => {
      contract.safeCall[method] = this.createSafeMethod(contract, method)
    })
    return contract
  }

  private createSafeMethod(contract: ethers.Contract, method: string) {
    this.logger.log(`Create safe method [method=${method}]`)
    return async (...args: any[]) => {
      await contract.callStatic[method](...args)

      return contract[method](...args)
    }
  }
}

const ethersService = new EthersService()
export default ethersService
