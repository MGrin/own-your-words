import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EtherModule } from '../ether/EtherModule';
import { EtherService } from '../ether/EtherService';
import { TwitterModule } from '../twitter/TwitterModule';
import { TwitterService } from '../twitter/TwitterService';
import { YandexObjectStorageModule } from '../yandexObjectStorage/YandexObjectStorageModule';
import { YandexObjectStorageService } from '../yandexObjectStorage/YandexObjectStorageService';
import { OWWController } from './OWWController';
import { OWWService } from './OWWService';

@Module({
  imports: [
    ConfigModule,
    EtherModule,
    YandexObjectStorageModule,
    TwitterModule,
  ],
  providers: [
    OWWService,
    EtherService,
    YandexObjectStorageService,
    TwitterService,
  ],
  controllers: [OWWController],
  exports: [],
})
export class OWWModule {}
