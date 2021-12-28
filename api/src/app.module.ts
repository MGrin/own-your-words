import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { DiscordModule } from './modules/discord/DiscordModule';
import { DiscordAuthOracleModule } from './modules/discordAuthOracle/DiscordAuthOracleModule';
import { EtherModule } from './modules/ether/EtherModule';
import { OWSNModule } from './modules/owsn/OWSNModule';
import { OWWModule } from './modules/oww/OWWModule';
import { TwitterModule } from './modules/twitter/TwitterModule';
import { TwitterAuthOracleModule } from './modules/twitterAuthOracle/TwitterAuthOracleModule';
import { TwitterPostOracleModule } from './modules/twitterPostOracle/TwitterPostOracleModule';
import { YandexObjectStorageModule } from './modules/yandexObjectStorage/YandexObjectStorageModule';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    YandexObjectStorageModule,
    TwitterModule,
    EtherModule,
    TwitterAuthOracleModule,
    TwitterPostOracleModule,
    OWSNModule,
    OWWModule,
    DiscordModule,
    DiscordAuthOracleModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
