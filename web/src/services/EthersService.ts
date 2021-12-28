import { ethers } from 'ethers'
import { Logger } from './Logger'
import { OWSNService } from './OWSNService'
import { TMService } from './TMService'
import store from '../redux/store'
import { changeAvailability, connect } from '../redux/actions/web3'
import { getApiUrl } from '../utils'
import { OWWService } from './OWWService'
import { TPMService } from './TPMService'
import { TAOService } from './TAOService'
import { TPOService } from './TPOService'
import { DMService } from './DMService'
import { DAOService } from './DAOService'

export enum SupportedNetworks {
  localhost = 'localhost',
  rinkeby = 'rinkeby',
}

export enum AvailableContracts {
  owsn = 'OWSN',
  tm = 'TM',
  tao = 'TAO',
  dao = 'DAO',
  dm = 'DM',
  oww = 'OWW',
  tpm = 'TPM',
  tpo = 'TPO',
}

export const getSweetAddress = (address: string) =>
  `${address.slice(0, 6)}...${address.slice(
    address.length - 4,
    address.length
  )}`

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
    [AvailableContracts.tao]?: TAOService
    [AvailableContracts.dm]?: DMService
    [AvailableContracts.dao]?: DAOService
    [AvailableContracts.oww]?: OWWService
    [AvailableContracts.tpm]?: TPMService
    [AvailableContracts.tpo]?: TPOService
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

    // @ts-expect-error
    window.ethereum.on('networkChanged', () => {
      store.dispatch(connect())
    })

    // @ts-expect-error
    window.ethereum.on('accountsChanged', () => {
      store.dispatch(connect())
    })
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

    const contractsLoaders = [
      this.loadContract(AvailableContracts.owsn, [
        'mintTwitter',
        'mintDiscord',
      ]),
      this.loadContract(AvailableContracts.tm),
      this.loadContract(AvailableContracts.oww, ['mintTwitterPost']),
      this.loadContract(AvailableContracts.tpm),
      this.loadContract(AvailableContracts.tao),
      this.loadContract(AvailableContracts.tpo),
      this.loadContract(AvailableContracts.dao),
      this.loadContract(AvailableContracts.dm),
    ]

    const contracts = await Promise.all(contractsLoaders)
    this.contractServices = {
      [AvailableContracts.owsn]: new OWSNService(contracts[0]),
      [AvailableContracts.tm]: new TMService(contracts[1], this.address),
      [AvailableContracts.oww]: new OWWService(contracts[2]),
      [AvailableContracts.tpm]: new TPMService(contracts[3], this.address),
      [AvailableContracts.tao]: new TAOService(contracts[4]),
      [AvailableContracts.tpo]: new TPOService(contracts[5]),
      [AvailableContracts.dao]: new DAOService(contracts[6]),
      [AvailableContracts.dm]: new DMService(contracts[7], this.address),
    }

    localStorage.setItem('autoconnect', 'true')
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

  public getTAO() {
    return this.contractServices
      ? this.contractServices[AvailableContracts.tao]
      : undefined
  }

  public getOWW() {
    return this.contractServices
      ? this.contractServices[AvailableContracts.oww]
      : undefined
  }

  public getTPM() {
    return this.contractServices
      ? this.contractServices[AvailableContracts.tpm]
      : undefined
  }

  public getTPO() {
    return this.contractServices
      ? this.contractServices[AvailableContracts.tpo]
      : undefined
  }

  public getDAO() {
    return this.contractServices
      ? this.contractServices[AvailableContracts.dao]
      : undefined
  }

  public getDM() {
    return this.contractServices
      ? this.contractServices[AvailableContracts.dm]
      : undefined
  }

  private async loadContract(
    symbol: AvailableContracts,
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

    const contractDetailsResponse = await fetch(
      `${getApiUrl()}/contracts/${symbol}`
    )
    const { address, abi } = await contractDetailsResponse.json()

    const contract = new ethers.Contract(
      address,
      abi.abi,
      this.provider
    ).connect(this.account)

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
