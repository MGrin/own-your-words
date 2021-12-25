import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EtherModule } from '../ether/EtherModule';
import { EtherService } from '../ether/EtherService';
import { TwitterModule } from '../twitter/TwitterModule';
import { TwitterPostOracleService } from './TwitterPostOracleService';

@Module({
  imports: [ConfigModule, TwitterModule, EtherModule],
  providers: [TwitterPostOracleService, EtherService],
  exports: [],
})
export class TwitterPostOracleModule {}
