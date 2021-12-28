import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EtherModule } from '../ether/EtherModule';
import { EtherService } from '../ether/EtherService';
import { DiscordModule } from '../discord/DiscordModule';
import { DiscordAuthOracleService } from './DiscordAuthOracleService';

@Module({
  imports: [ConfigModule, DiscordModule, EtherModule],
  providers: [DiscordAuthOracleService, EtherService],
  exports: [],
})
export class DiscordAuthOracleModule {}
