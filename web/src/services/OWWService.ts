import { ethers } from 'ethers'
import ethersService from './EthersService'
import { Logger } from './Logger'

export type Oww = {
  id: number
  owner: string
  sn_name: string
  sn_id: string
  sn_url: string
}

export class OWWService {
  private readonly logger = new Logger('OWWService')

  private contract: ethers.Contract

  constructor(_contract: ethers.Contract) {
    this.logger.log('Constructor')

    this.contract = _contract
  }

  public async mintTwitterOWW(postId: string, price: string) {
    this.logger.log('Mint twitter OWW')

    await this.contract.safeCall.mintTwitterPost(postId, {
      value: ethers.utils.parseEther(price),
    })
  }

  public async isPostAvailable(genSnId: string) {
    this.logger.log(`Is post available [genSnId=${genSnId}]`)
    return this.contract.isPostAvailable(genSnId)
  }

  public async getOWWTokens(address: string) {
    this.logger.log(`Get owned OWW tokens`)
    const amountOfTokensBN: ethers.BigNumber = await this.contract.balanceOf(
      ethersService.address
    )

    const amountOfTokens = amountOfTokensBN.toNumber()

    const tokenIds: number[] = []
    for (let i = 0; i < amountOfTokens; i++) {
      const tokenId: ethers.BigNumber = await this.contract.tokenOfOwnerByIndex(
        address,
        i
      )
      tokenIds.push(tokenId.toNumber() || 0)
    }

    return tokenIds
  }

  public getGenId(snName: string, snId: string) {
    return `${snName}${snId}`
  }
}
