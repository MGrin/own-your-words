import { Controller, Get, Param } from '@nestjs/common';
import { Bucket } from '../yandexObjectStorage/Bucket';
import { YandexObjectStorageService } from '../yandexObjectStorage/YandexObjectStorageService';
import { OWSNService } from './OWSNService';

@Controller('OWSN')
export class OWSNController {
  constructor(
    private readonly owsnService: OWSNService,
    private readonly yaStorage: YandexObjectStorageService,
  ) {}

  @Get(':tokenId')
  public async getOWSNTokenMetadata(@Param() { tokenId }) {
    const ownedAccount = await this.owsnService.getOwnedAccountByToken(tokenId);
    let imageUrl = await this.yaStorage.get(Bucket.owsn, `${tokenId}.png`);
    if (!imageUrl) {
      const imageBuffer = await this.owsnService.generateImage(ownedAccount);
      imageUrl = await this.yaStorage.upload(
        Bucket.owsn,
        `${tokenId}.png`,
        imageBuffer,
      );
    }

    return {
      name: `${ownedAccount.sn_name}:${ownedAccount.sn_id}`,
      description: `OWSN Token for ${ownedAccount.sn_name} account`,
      external_url: ownedAccount.sn_url,
      image: imageUrl,
      attributes: [
        {
          trait_type: 'Social Network',
          value: ownedAccount.sn_name,
        },
      ],
    };
  }
}
