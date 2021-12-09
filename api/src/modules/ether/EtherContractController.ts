import { Controller, Get, Param } from '@nestjs/common';
import { EtherService } from './EtherService';

@Controller('contracts')
export class EtherContractController {
  constructor(private readonly etherService: EtherService) {}

  @Get(':symbol')
  public async getOWSNContract(@Param() { symbol }) {
    return this.etherService.getContractDetails(symbol);
  }
}
