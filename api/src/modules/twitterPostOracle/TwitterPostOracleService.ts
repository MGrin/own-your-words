import { Injectable, Logger } from '@nestjs/common';
import { ethers } from 'ethers';
import { EtherService } from '../ether/EtherService';
import { TwitterService } from '../twitter/TwitterService';
import { SolidityEvents } from './SolidityEvents';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TwitterPostOracleService {
  private readonly logger: Logger = new Logger('TwitterPostOracleService');

  private tpo: ethers.Contract;
  private owsn: ethers.Contract;

  constructor(
    private readonly twitterService: TwitterService,
    private readonly etherService: EtherService,
  ) {
    this.tpo = this.etherService.loadContract('TPO', [
      'startProcessing',
      'succeeded',
      'failed',
    ]);

    this.owsn = this.etherService.loadContract('OWSN');
    this.tpo.on(
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
      await this.tpo.callStatic.getPendingRequestsIdsFromQueue();

    if (pendingRequestsCount === 0) {
      return;
    }

    this.logger.log(
      `Pull pending requests [expectedCount=${pendingRequestsCount}]`,
    );

    const tx = await this.tpo.getPendingRequestsIdsFromQueue();
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
      startTx = await this.tpo.safeCall.startProcessing(requestId);
      const request = await this.tpo.getRequestById(requestId);
      const postId = request.postId;
      const requestOwner = request.owner;
      const post = await this.twitterService.getPostById(postId);

      const owsnToken = await this.owsn.getOWSNByGenSnId(
        `twitter${post.user.id}`,
      );

      const owner = await this.owsn.ownerOf(owsnToken.id);

      if (owner !== requestOwner) {
        throw new Error('Requesting account is not an owner of social network');
      }

      await startTx.wait();

      const succeedTx = await this.tpo.safeCall.succeeded(
        requestId,
        postId,
        `https://twitter.com/${post.user.screen_name}/status/${postId}`,
      );
      await succeedTx.wait();
    } catch (err) {
      try {
        this.logger.error(err);
        if (startTx) {
          await startTx.wait();
        }
        const failedTx = await this.tpo.safeCall.failed(
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
