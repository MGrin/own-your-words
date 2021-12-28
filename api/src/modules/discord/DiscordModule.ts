import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DiscordController } from './DiscordController';
import { DiscordService } from './DiscordService';

@Module({
  imports: [ConfigModule],
  providers: [DiscordService],
  controllers: [DiscordController],
  exports: [DiscordService],
})
export class DiscordModule {}
