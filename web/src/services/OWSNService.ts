import { ethers } from 'ethers'
import ethersService from './EthersService'
import { Logger } from './Logger'

export type OwnedAccount = {
  id: number
  owner: string
  sn_name: string
  sn_id: string
  sn_url: string
}

export class OWSNService {
  private readonly logger = new Logger('OWSNService')

  private contract: ethers.Contract

  constructor(_contract: ethers.Contract) {
    this.logger.log('Constructor')

    this.contract = _contract
  }

  public async mintTwitterOWSN(token: string, verifier: string, price: string) {
    this.logger.log('Mint twitter OWSN')

    await this.contract.safeCall.mintTwitter(token, verifier, {
      value: ethers.utils.parseEther(price),
    })
  }

  public async getOWSNByGenSnId(genSnId: string): Promise<OwnedAccount> {
    this.logger.log(`Get OWSN by genSnId [genSnId=${genSnId}]`)

    return await this.contract.getOWSNByGenSnId(genSnId)
  }

  public async ownerOf(tokenId: number) {
    this.logger.log(`owner of [tokenId=${tokenId}]`)

    return await this.contract.ownerOf(tokenId)
  }

  public async isAccountAvailable(genSnId: string) {
    this.logger.log(`IsAccountAvailable [genSnId=${genSnId}]`)

    return await this.contract.isAccountAvailable(genSnId)
  }

  public async getOwnedAccountTokens(address: string) {
    this.logger.log(`Get owned tokens`)
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
