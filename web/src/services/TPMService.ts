import { ethers } from 'ethers'
import { mintPostFailure, mintPostSuccess } from '../redux/actions/oww'
import store from '../redux/store'
import { WebRoutes } from '../WebRoutes'
import { Logger } from './Logger'

export enum TPMEvents {
  postRequestSubmited = 'TwitterPostRequestSubmited',
  postRequestSucceeded = 'TwitterPostRequestSucceeded',
  postRequestFailed = 'TwitterPostRequestFailed',
}

export class TPMService {
  private readonly logger = new Logger('TPMService')

  private contract: ethers.Contract

  private user?: string

  private pendingRequests: number[] = []

  constructor(_contract: ethers.Contract, _address: string) {
    this.logger.log('Constructor')
    this.contract = _contract
    this.user = _address

    this.contract.on(TPMEvents.postRequestSubmited, (sender, requestId) => {
      this.onRequestSubmitted(sender, requestId)
    })
    this.contract.on(TPMEvents.postRequestSucceeded, (requestId, token) => {
      this.onRequestSucceeded(requestId, token)
    })
    this.contract.on(TPMEvents.postRequestFailed, (requestId, error) => {
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
        TPMEvents.postRequestSubmited
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

    if (!tokId) {
      return
    }

    this.logger.log(
      `On ${TPMEvents.postRequestSucceeded} event handler [tokenId=${tokId}][requestId=${reqId}]`
    )

    store.dispatch(mintPostSuccess({ tokenId: tokId }))

    window.location.href = `${window.location.origin}${WebRoutes.words}`
    this.removePendingRequest(Number(reqId))
  }

  private async onRequestFailed(requestId: ethers.BigNumberish, error: string) {
    const reqId = ethers.utils.formatEther(requestId)

    if (!this.pendingRequests.includes(Number(reqId))) {
      return
    }

    this.logger.log(
      `On ${TPMEvents.postRequestFailed} event handler [error=${error}][requestId=${reqId}]`
    )

    store.dispatch(mintPostFailure({ error: new Error(error) }))

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
