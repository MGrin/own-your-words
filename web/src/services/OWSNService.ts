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

  private tmAddress?: string

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

  public async getTMAddress() {
    this.logger.log('Get TM address')
    if (!this.tmAddress) {
      this.tmAddress = await this.contract.twitterMinter()
    }

    return this.tmAddress
  }

  public async getOwnedAccountByGenSnId(genSnId: string) {
    this.logger.log(`Get owned account by gen_sn_id [genSnId=${genSnId}]`)
    return this.contract.getOwnedAccountByGenSnId(genSnId)
  }

  public async getOwnedAccountByToken(token: number): Promise<OwnedAccount> {
    this.logger.log(`Get owned account by token [token=${token}]`)
    const result = await this.contract.getOwnedAccountByToken(token)
    return {
      id: result.id.toNumber(),
      owner: result.owner,
      sn_id: result.sn_id,
      sn_name: result.sn_name,
      sn_url: result.sn_url,
    }
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
