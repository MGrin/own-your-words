import { ethers } from 'ethers'
import { mintTwitterFailure, mintTwitterSuccess } from '../redux/actions/owsn'
import store from '../redux/store'
import { WebRoutes } from '../WebRoutes'
import { Logger } from './Logger'

export enum TMEvents {
  authRequestSubmited = 'TwitterAuthRequestSubmited',
  authRequestSucceeded = 'TwitterAuthRequestSucceeded',
  authRequestFailed = 'TwitterAuthRequestFailed',
}

export class TMService {
  private readonly logger = new Logger('TMService')

  private contract: ethers.Contract

  private user?: string

  private pendingRequests: number[] = []

  constructor(_contract: ethers.Contract, _address: string) {
    this.logger.log('Constructor')
    this.contract = _contract
    this.user = _address

    this.contract.on(TMEvents.authRequestSubmited, (sender, requestId) => {
      this.onRequestSubmitted(sender, requestId)
    })
    this.contract.on(TMEvents.authRequestSucceeded, (requestId, token) => {
      this.onRequestSucceeded(requestId, token)
    })
    this.contract.on(TMEvents.authRequestFailed, (requestId, error) => {
      this.onRequestFailed(requestId, error)
    })
  }

  private async onRequestSubmitted(
    sender: string,
    requestId: ethers.BigNumber
  ) {
    if (sender !== this.user) {
      return
    }

    this.logger.log(
      `On ${
        TMEvents.authRequestSubmited
      } event handler [sender=${sender}][requestId=${requestId.toString()}]`
    )

    this.addPendingRequest(requestId.toNumber())
    setTimeout(() => {
      if (!this.pendingRequests.includes(Number(requestId.toNumber()))) {
        return
      }

      this.onRequestSucceeded(requestId)
    }, 30000)
  }

  private async onRequestSucceeded(
    requestId: ethers.BigNumberish,
    tokenId?: ethers.BigNumberish
  ) {
    const reqId = ethers.utils.formatEther(requestId)
    const tokId = tokenId ? ethers.utils.formatEther(tokenId) : undefined

    if (!this.pendingRequests.includes(Number(reqId))) {
      return
    }

    this.logger.log(
      `On ${TMEvents.authRequestSucceeded} event handler [tokenId=${tokId}][requestId=${reqId}]`
    )

    if (tokId) {
      store.dispatch(mintTwitterSuccess({ tokenId: tokId }))
    }

    window.location.href = `${window.location.origin}${WebRoutes.accounts}`
    this.removePendingRequest(Number(reqId))
  }

  private async onRequestFailed(requestId: ethers.BigNumberish, error: string) {
    const reqId = ethers.utils.formatEther(requestId)

    if (!this.pendingRequests.includes(Number(reqId))) {
      return
    }

    this.logger.log(
      `On ${TMEvents.authRequestFailed} event handler [error=${error}][requestId=${reqId}]`
    )

    store.dispatch(mintTwitterFailure({ error: new Error(error) }))
    this.removePendingRequest(Number(reqId))
  }

  private addPendingRequest(requestId: number) {
    this.pendingRequests.push(requestId)
  }

  private removePendingRequest(requestId: number) {
    this.pendingRequests = this.pendingRequests.filter((id) => id !== requestId)
  }

  public async getPrice() {
    this.logger.log('Get price')
    const price = await this.contract.getPriceWEI()
    return ethers.utils.formatEther(price)
  }
}
