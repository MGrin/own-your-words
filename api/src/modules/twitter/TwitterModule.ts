import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TwitterController } from './TwitterController';
import { TwitterService } from './TwitterService';

@Module({
  imports: [ConfigModule],
  providers: [TwitterService],
  controllers: [TwitterController],
  exports: [TwitterService],
})
export class TwitterModule {}
