import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';

@Injectable()
export class EtherService {
  private readonly logger: Logger = new Logger('EtherService');

  private provider: ethers.providers.BaseProvider;
  private account: ethers.Wallet;

  constructor(private readonly configs: ConfigService) {
    const rpcProviderUrl = this.configs.get<string>('RPC_PROVIDER_URL');
    this.logger.log(rpcProviderUrl);
    const deployerPrivateKey = this.configs.get<string>('DEPLOYER_PRIVATE_KEY');

    this.provider = new ethers.providers.JsonRpcBatchProvider(rpcProviderUrl);
    this.account = new ethers.Wallet(`0x${deployerPrivateKey}`, this.provider);
  }

  public loadContract(
    symbol: string,
    abi: any,
    mayFailOverrides: string[] = [],
  ): ethers.Contract {
    this.logger.log(
      `Load contract [symbol=${symbol}][mayFailOverrides=${mayFailOverrides.join(
        ', ',
      )}]`,
    );
    const contractAddress = this.configs.get<string>(`${symbol}_CONTRACT`);
    const contract = new ethers.Contract(
      contractAddress,
      abi,
      this.provider,
    ).connect(this.account);

    // @ts-expect-error yeah
    contract.safeCall = {};
    mayFailOverrides.forEach((method) => {
      contract.safeCall[method] = this.createSafeMethod(contract, method);
    });
    return contract;
  }

  private createSafeMethod(contract: ethers.Contract, method: string) {
    this.logger.log(`Create safe method [method=${method}]`);
    return async (...args) => {
      try {
        await contract.callStatic[method](...args);
      } catch (err) {
        throw err;
      }

      return contract[method](...args);
    };
  }
}
