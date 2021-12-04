import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EtherModule } from '../ether/EtherModule';
import { EtherService } from '../ether/EtherService';
import { YandexObjectStorageModule } from '../yandexObjectStorage/YandexObjectStorageModule';
import { YandexObjectStorageService } from '../yandexObjectStorage/YandexObjectStorageService';
import { OWSNController } from './OWSNController';
import { OWSNService } from './OWSNService';

@Module({
  imports: [ConfigModule, EtherModule, YandexObjectStorageModule],
  providers: [OWSNService, EtherService, YandexObjectStorageService],
  controllers: [OWSNController],
  exports: [],
})
export class OWSNModule {}
