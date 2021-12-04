import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { YandexObjectStorageService } from './YandexObjectStorageService';

@Module({
  imports: [ConfigModule],
  providers: [YandexObjectStorageService],
  exports: [YandexObjectStorageService],
})
export class YandexObjectStorageModule {}
