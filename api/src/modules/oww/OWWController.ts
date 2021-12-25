import { Controller, Get, Param } from '@nestjs/common';
import { OWWService } from './OWWService';

@Controller('OWW')
export class OWWController {
  constructor(private readonly owwService: OWWService) {}

  @Get(':tokenId')
  public async getOWWTokenMetadata(@Param() { tokenId }) {
    const ownedWords = await this.owwService.getOWWByTokenId(tokenId);
    return await this.owwService.getOpenSeaMetadata(ownedWords);
  }
}
