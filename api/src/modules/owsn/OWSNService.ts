import { Injectable, Logger } from '@nestjs/common';
import { ethers } from 'ethers';
import { createCanvas, loadImage } from 'canvas';
import { EtherService } from '../ether/EtherService';
import { SocialNetwork } from './SocialNetwork';
import { OpenSeaMetadata } from '../common/types';
import { getBackgroundColorForToken, roundRect } from '../common/images';
import { YandexObjectStorageService } from '../yandexObjectStorage/YandexObjectStorageService';
import { Bucket } from '../yandexObjectStorage/Bucket';
import { TwitterService } from '../twitter/TwitterService';

export type OwnedAccount = {
  id: number;
  owner: string;
  sn_name: SocialNetwork;
  sn_id: string;
  sn_url: string;
};

export type OWSNAttributes = {
  Background: string;
  'Social Network': string;
};
@Injectable()
export class OWSNService {
  private readonly logger: Logger = new Logger('OWSNService');

  private owsn: ethers.Contract;

  constructor(
    private readonly etherService: EtherService,
    private readonly yaStorage: YandexObjectStorageService,
    private readonly twitterService: TwitterService,
  ) {
    this.owsn = this.etherService.loadContract('OWSN');
  }

  public async getOWSNByTokenId(token: number): Promise<OwnedAccount> {
    this.logger.log(`Get owned account by token [token=${token}]`);

    const result = await this.owsn.getOWSNByTokenId(token);
    const ownedAccount = {
      id: result.id.toNumber(),
      owner: result.owner,
      sn_id: result.sn_id,
      sn_name: result.sn_name,
      sn_url: result.sn_url,
    };

    return ownedAccount;
  }

  private getAttributes(ownedAccount: OwnedAccount): OWSNAttributes {
    return {
      Background: getBackgroundColorForToken(ownedAccount.id),
      'Social Network': ownedAccount.sn_name,
    };
  }

  public async getOpenSeaMetadata(
    ownedAccount: OwnedAccount,
  ): Promise<OpenSeaMetadata> {
    const attributes = this.getAttributes(ownedAccount);
    let imageUrl = await this.yaStorage.get(
      Bucket.owsn,
      `${ownedAccount.id}.png`,
    );
    if (!imageUrl) {
      const imageBuffer = await this.generateImage(ownedAccount);
      imageUrl = await this.yaStorage.upload(
        Bucket.owsn,
        `${ownedAccount.id}.png`,
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
          value: attributes['Social Network'],
        },
        {
          trait_type: 'Background',
          value: attributes['Background'],
        },
      ],
    };
  }

  private async generateImage(ownedAccount: OwnedAccount): Promise<Buffer> {
    switch (ownedAccount.sn_name) {
      case SocialNetwork.twitter: {
        const urlSplitted = ownedAccount.sn_url.split('/');
        const screenName = urlSplitted[urlSplitted.length - 1];
        const user = await this.twitterService.getUserByScreenName(screenName);
        const avatar = user.profile_image_url_https;
        const attributes = this.getAttributes(ownedAccount);
        return await this.generateTwitterImage(
          avatar,
          screenName,
          attributes.Background,
        );
      }
      default: {
        throw new Error(`Unknown sn_name: ${ownedAccount.sn_name}`);
      }
    }
  }

  private async generateTwitterImage(
    avatar: string,
    name: string,
    bg: string,
  ): Promise<Buffer> {
    const canvas = createCanvas(600, 600);
    const ctx = canvas.getContext('2d');

    if (bg.indexOf('#') === 0) {
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, 600, 600);
    } else {
      const bgImage = await loadImage(`${__dirname}/../../images/${bg}.jpg`);
      ctx.drawImage(bgImage, 0, 0, 600, 600);
    }

    ctx.fillStyle = '#ffffff';
    roundRect(ctx, 125, 412, 350, 50, 12);

    roundRect(ctx, 250, 488, 100, 100, 50);
    ctx.fillStyle = '#000000';
    ctx.font = "30pt 'Azeret Mono'";

    ctx.fillText(`@${name}`, 135, 450);

    const avatarImg = await loadImage(avatar);
    ctx.drawImage(avatarImg, 125, 50, 350, 350);

    const logoImg = await loadImage(
      'https://cdn.cms-twdigitalassets.com/content/dam/developer-twitter/images/Twitter_logo_blue_48.png',
    );
    ctx.drawImage(logoImg, 260, 500, 80, 80);
    return canvas.toBuffer();
  }
}
