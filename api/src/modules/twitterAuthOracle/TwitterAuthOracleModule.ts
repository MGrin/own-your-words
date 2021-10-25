import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EtherModule } from '../ether/EtherModule';
import { EtherService } from '../ether/EtherService';
import { TwitterModule } from '../twitter/TwitterModule';
import { TwitterAuthOracleService } from './TwitterAuthOracleService';

@Module({
  imports: [ConfigModule, TwitterModule, EtherModule],
  providers: [TwitterAuthOracleService, EtherService],
  exports: [],
})
export class TwitterAuthOracleModule {}
