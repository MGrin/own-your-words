import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EtherModule } from './modules/ether/EtherModule';
import { TwitterModule } from './modules/twitter/TwitterModule';
import { TwitterAuthOracleModule } from './modules/twitterAuthOracle/TwitterAuthOracleModule';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TwitterModule,
    EtherModule,
    TwitterAuthOracleModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
