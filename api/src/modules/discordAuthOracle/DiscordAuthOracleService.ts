import { Injectable, Logger } from '@nestjs/common';
import { ethers } from 'ethers';
import { EtherService } from '../ether/EtherService';
import { DiscordService } from '../discord/DiscordService';
import { SolidityEvents } from './SolidityEvents';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class DiscordAuthOracleService {
  private readonly logger: Logger = new Logger('DiscordAuthOracleService');

  private dao: ethers.Contract;

  constructor(
    private readonly discordService: DiscordService,
    private readonly etherService: EtherService,
  ) {
    this.dao = this.etherService.loadContract('DAO', [
      'startProcessing',
      'succeeded',
      'failed',
    ]);

    if (this.dao) {
      this.dao.on(
        SolidityEvents.newPendingRequest,
        this.handleNewPendingRequestEvent.bind(this),
      );
    }
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
      await this.dao.callStatic.getPendingRequestsIdsFromQueue();

    if (pendingRequestsCount === 0) {
      return;
    }

    this.logger.log(
      `Pull pending requests [expectedCount=${pendingRequestsCount}]`,
    );

    const tx = await this.dao.getPendingRequestsIdsFromQueue();
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
      startTx = await this.dao.safeCall.startProcessing(requestId);
      const request = await this.dao.getRequestById(requestId);
      const code = this.etherService.decrypt(request.code);
      const redirectUrl = this.etherService.decrypt(request.redirectUrl);
      await startTx.wait();

      const accessToken = await this.discordService.getAccessToken(
        code,
        redirectUrl,
      );
      const user = await this.discordService.getUserByAccessToken(accessToken);

      const succeedTx = await this.dao.safeCall.succeeded(
        requestId,
        `${user.username}#${user.discriminator}`,
        user.id,
      );
      await succeedTx.wait();
    } catch (err) {
      try {
        this.logger.error(err);
        if (startTx) {
          await startTx.wait();
        }
        const failedTx = await this.dao.safeCall.failed(
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
