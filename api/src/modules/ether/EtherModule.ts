import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EtherContractController } from './EtherContractController';
import { EtherService } from './EtherService';
import { EtherUtilsController } from './EtherUtilsController';

@Module({
  imports: [ConfigModule],
  providers: [EtherService],
  controllers: [EtherContractController, EtherUtilsController],
  exports: [],
})
export class EtherModule {}
