import { ethers } from "ethers";
import { mintTwitterFailure, mintTwitterSuccess } from "../redux/actions/owsn";
import store from "../redux/store";
import { Logger } from "./Logger";

export enum TMEvents {
  authRequestSubmited = "TwitterAuthRequestSubmited",
  authRequestSucceeded = "TwitterAuthRequestSucceeded",
  authRequestFailed = "TwitterAuthRequestFailed",
}

export class TMService {
  public static PENDING_REQUESTS_STORAGE_KEY: string = "TM_pendingRequests";

  private readonly logger = new Logger("TMService");

  private contract: ethers.Contract;
  private user?: string;
  private pendingRequests: string[] = [];

  constructor(_contract: ethers.Contract, _address: string) {
    this.logger.log("Constructor");
    this.contract = _contract;
    this.user = _address;

    const pendingRequests = localStorage.getItem(
      TMService.PENDING_REQUESTS_STORAGE_KEY
    );
    if (pendingRequests) {
      this.pendingRequests = JSON.parse(pendingRequests);
    }

    this.contract.on(
      TMEvents.authRequestSubmited,
      this.onRequestSubmitted.bind(this)
    );
    this.contract.on(
      TMEvents.authRequestSucceeded,
      this.onRequestSucceeded.bind(this)
    );
    this.contract.on(
      TMEvents.authRequestFailed,
      this.onRequestFailed.bind(this)
    );
  }

  private async onRequestSubmitted(
    sender: string,
    requestId: ethers.BigNumberish
  ) {
    if (sender !== this.user) {
      return;
    }

    this.logger.log(
      `On ${TMEvents.authRequestSubmited} event handler [sender=${sender}][requestId=${requestId}]`
    );

    this.addPendingRequest(ethers.utils.formatEther(requestId));
  }

  private async onRequestSucceeded(
    requestId: ethers.BigNumberish,
    tokenId: ethers.BigNumberish
  ) {
    const reqId = ethers.utils.formatEther(requestId);
    const tokId = ethers.utils.formatEther(tokenId);

    if (this.pendingRequests.indexOf(reqId) === -1) {
      return;
    }

    this.logger.log(
      `On ${TMEvents.authRequestSucceeded} event handler [tokenId=${tokId}][requestId=${reqId}]`
    );

    store.dispatch(mintTwitterSuccess({ tokenId: tokId }));
    this.removePendingRequest(reqId);
  }

  private async onRequestFailed(requestId: ethers.BigNumberish, error: string) {
    const reqId = ethers.utils.formatEther(requestId);

    if (this.pendingRequests.indexOf(reqId) === -1) {
      return;
    }

    this.logger.log(
      `On ${TMEvents.authRequestFailed} event handler [error=${error}][requestId=${reqId}]`
    );

    store.dispatch(mintTwitterFailure({ error: new Error(error) }));
    this.removePendingRequest(reqId);
  }

  private addPendingRequest(requestId: string) {
    this.pendingRequests.push(requestId);
    localStorage.setItem(
      TMService.PENDING_REQUESTS_STORAGE_KEY,
      JSON.stringify(this.pendingRequests)
    );
  }

  private removePendingRequest(requestId: string) {
    this.pendingRequests = this.pendingRequests.filter(
      (id) => id === requestId
    );
    localStorage.setItem(
      TMService.PENDING_REQUESTS_STORAGE_KEY,
      JSON.stringify(this.pendingRequests)
    );
  }

  public async getPrice() {
    this.logger.log("Get price");
    const price = await this.contract.getPriceWEI();
    return ethers.utils.formatEther(price);
  }
}
