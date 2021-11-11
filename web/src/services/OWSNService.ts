import { ethers } from "ethers";
import ethersService from "./EthersService";
import { Logger } from "./Logger";

export type OwnedAccount = {
  id: number;
  owner: string;
  sn_name: string;
  sn_id: string;
  sn_url: string;
};

export class OWSNService {
  private readonly logger = new Logger("OWSNService");

  private tmAddress?: string;
  private contract: ethers.Contract;

  constructor(_contract: ethers.Contract) {
    this.logger.log("Constructor");

    this.contract = _contract;
  }

  public async mintTwitterOWSN(token: string, verifier: string, price: string) {
    this.logger.log("Mint twitter OWSN");
    await this.contract.safeCall.mintTwitter(token, verifier, {
      value: ethers.utils.parseEther(price),
    });
  }

  public async getTMAddress() {
    this.logger.log("Get TM address");
    if (!this.tmAddress) {
      this.tmAddress = await this.contract.twitterMinter();
    }

    return this.tmAddress;
  }

  public async getOwnedAccountByGenSnId(genSnId: string) {
    this.logger.log(`Get owned account by gen_sn_id [genSnId=${genSnId}]`);
    return this.contract.getOwnedAccountByGenSnId(genSnId);
  }

  public async getOwnedAccountTokens() {
    this.logger.log(`Get owned accounts`);
    const tokenIds: ethers.BigNumberish[] = await this.contract.balanceOf(
      ethersService.address
    );
    return tokenIds.map((tokenId) => ethers.utils.formatEther(tokenId));
  }

  public getGenId(snName: string, snId: string) {
    return `${snName}${snId}`;
  }
}
