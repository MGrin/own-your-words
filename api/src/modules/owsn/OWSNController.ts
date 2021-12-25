import { Controller, Get, Param } from '@nestjs/common';
import { Bucket } from '../yandexObjectStorage/Bucket';
import { OWSNService } from './OWSNService';

@Controller('OWSN')
export class OWSNController {
  constructor(private readonly owsnService: OWSNService) {}

  @Get(':tokenId')
  public async getOWSNTokenMetadata(@Param() { tokenId }) {
    const ownedAccount = await this.owsnService.getOWSNByTokenId(tokenId);
    return await this.owsnService.getOpenSeaMetadata(ownedAccount);
  }
}
