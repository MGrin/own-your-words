import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DiscordModule } from '../discord/DiscordModule';
import { DiscordService } from '../discord/DiscordService';
import { EtherModule } from '../ether/EtherModule';
import { EtherService } from '../ether/EtherService';
import { TwitterModule } from '../twitter/TwitterModule';
import { TwitterService } from '../twitter/TwitterService';
import { YandexObjectStorageModule } from '../yandexObjectStorage/YandexObjectStorageModule';
import { YandexObjectStorageService } from '../yandexObjectStorage/YandexObjectStorageService';
import { OWSNController } from './OWSNController';
import { OWSNService } from './OWSNService';

@Module({
  imports: [
    ConfigModule,
    EtherModule,
    YandexObjectStorageModule,
    TwitterModule,
    DiscordModule,
  ],
  providers: [
    OWSNService,
    EtherService,
    YandexObjectStorageService,
    TwitterService,
    DiscordService,
  ],
  controllers: [OWSNController],
  exports: [],
})
export class OWSNModule {}
