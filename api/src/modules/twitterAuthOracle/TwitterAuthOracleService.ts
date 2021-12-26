import { Injectable, Logger } from '@nestjs/common';
import { ethers } from 'ethers';
import { EtherService } from '../ether/EtherService';
import { TwitterService } from '../twitter/TwitterService';
import { SolidityEvents } from './SolidityEvents';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TwitterAuthOracleService {
  private readonly logger: Logger = new Logger('TwitterAuthOracleService');

  private tao: ethers.Contract;

  constructor(
    private readonly twitterService: TwitterService,
    private readonly etherService: EtherService,
  ) {
    this.tao = this.etherService.loadContract('TAO', [
      'startProcessing',
      'succeeded',
      'failed',
    ]);

    this.tao.on(
      SolidityEvents.newPendingRequest,
      this.handleNewPendingRequestEvent.bind(this),
    );
  }

  public async handleNewPendingRequestEvent(requestId: number) {
    this.logger.log(
      `Handle new pending request event [requestId=${requestId}]`,
    );

    await this.processRequest(requestId);
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  public async pullPendingRequests() {
    if (process.env.NODE_ENV === 'local') {
      return;
    }
    const pendingRequestsCount =
      await this.tao.callStatic.getPendingRequestsIdsFromQueue();

    if (pendingRequestsCount === 0) {
      return;
    }

    this.logger.log(
      `Pull pending requests [expectedCount=${pendingRequestsCount}]`,
    );

    const tx = await this.tao.getPendingRequestsIdsFromQueue();
    const receipt = await tx.wait();

    this.logger.log(
      `Exact count of pending requests: ${receipt.events[0].args.count}`,
    );

    const requestsIds = [];
    for (let i = 0; i < receipt.events[0].args.count; i++) {
      requestsIds.push(receipt.events[0].args.requestsIds[i]);
    }

    const requestsProcessing = requestsIds.map(async (requestId) => {
      try {
        await this.processRequest(requestId);
      } catch (err) {
        this.logger.error(err);
      }
    });
    await Promise.all(requestsProcessing);
  }

  private async processRequest(requestId: number) {
    this.logger.log(`Process request [requestId=${requestId}]`);
    let startTx;
    try {
      startTx = await this.tao.safeCall.startProcessing(requestId);
      const request = await this.tao.getRequestById(requestId);
      const oauthToken = this.etherService.decrypt(request.oauthToken);
      const oauthVerifier = this.etherService.decrypt(request.oauthVerifier);

      const accessToken = await this.twitterService.getAccessToken(
        oauthToken,
        oauthVerifier,
      );

      await startTx.wait();
      const succeedTx = await this.tao.safeCall.succeeded(
        requestId,
        accessToken.screen_name,
        accessToken.user_id,
      );
      await succeedTx.wait();
    } catch (err) {
      try {
        this.logger.error(err);
        if (startTx) {
          await startTx.wait();
        }
        const failedTx = await this.tao.safeCall.failed(
          requestId,
          String(err.message),
        );
        await failedTx.wait();
      } catch (err) {
        this.logger.error(err);
      }
    }
  }
}
