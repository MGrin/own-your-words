import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import * as crypto from 'crypto';
@Injectable()
export class EtherService {
  private readonly logger: Logger = new Logger('EtherService');

  private provider: ethers.providers.BaseProvider;
  private account: ethers.Wallet;
  private encryptionKey: Buffer;

  constructor(private readonly configs: ConfigService) {
    const rpcProviderUrl = this.configs.get<string>('RPC_PROVIDER_URL');
    const deployerPrivateKey = this.configs.get<string>('DEPLOYER_PRIVATE_KEY');
    this.encryptionKey = Buffer.from(
      crypto
        .createHash('sha256')
        .update(String(deployerPrivateKey))
        .digest('base64')
        .substr(0, 32),
    );

    this.provider = new ethers.providers.JsonRpcBatchProvider(rpcProviderUrl);
    this.account = new ethers.Wallet(`0x${deployerPrivateKey}`, this.provider);
  }

  public getContractDetails(symbol: string) {
    const network = this.configs.get<string>('NETWORK');
    const address = this.configs.get<string>(
      `${symbol.toUpperCase()}_CONTRACT_${network.toUpperCase()}`,
    );

    // eslint-disable-next-line
    const abi = require(`../../abi/${network}/${symbol}.json`);
    return { address, abi };
  }

  public loadContract(
    symbol: string,
    mayFailOverrides: string[] = [],
  ): ethers.Contract {
    this.logger.log(
      `Load contract [symbol=${symbol}][mayFailOverrides=${mayFailOverrides.join(
        ', ',
      )}]`,
    );

    const { address, abi } = this.getContractDetails(symbol);

    const contract = new ethers.Contract(
      address,
      abi.abi,
      this.provider,
    ).connect(this.account);

    // @ts-expect-error yeah
    contract.safeCall = {};
    mayFailOverrides.forEach((method) => {
      contract.safeCall[method] = this.createSafeMethod(contract, method);
    });
    return contract;
  }

  public encrypt(message: string) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', this.encryptionKey, iv);
    let crypted = cipher.update(message);
    crypted = Buffer.concat([crypted, cipher.final()]);
    return iv.toString('hex') + ':' + crypted.toString('hex');
  }

  public decrypt(message: string) {
    const textParts = message.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      this.encryptionKey,
      iv,
    );
    let dec = decipher.update(encryptedText);
    dec = Buffer.concat([dec, decipher.final()]);
    return dec.toString();
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
