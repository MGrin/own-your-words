import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { EtherModule } from './modules/ether/EtherModule';
import { OWSNModule } from './modules/owsn/OWSNModule';
import { TwitterModule } from './modules/twitter/TwitterModule';
import { TwitterAuthOracleModule } from './modules/twitterAuthOracle/TwitterAuthOracleModule';
import { YandexObjectStorageModule } from './modules/yandexObjectStorage/YandexObjectStorageModule';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    YandexObjectStorageModule,
    TwitterModule,
    EtherModule,
    TwitterAuthOracleModule,
    OWSNModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
