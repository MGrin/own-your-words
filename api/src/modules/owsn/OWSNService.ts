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
import { DiscordService } from '../discord/DiscordService';

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
    private readonly discordService: DiscordService,
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
    this.logger.log(`Get attributes [ownedAccount=${ownedAccount.id}]`);
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

      case SocialNetwork.discord: {
        const user = await this.discordService.getUserById(ownedAccount.sn_id);
        const attributes = this.getAttributes(ownedAccount);
        const avatar = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=512`;
        return await this.generateDiscordImage(
          avatar,
          user.username,
          String(user.discriminator),
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
    this.logger.log('Generate Twitter image');

    const canvas = createCanvas(600, 600);
    const ctx = canvas.getContext('2d');

    if (bg.indexOf('#') === 0) {
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, 600, 600);
    } else {
      const bgImage = await loadImage(`${__dirname}/../../images/${bg}.jpg`);
      ctx.drawImage(bgImage, 0, 0, 600, 600);
    }

    ctx.fillStyle = '#000000';
    ctx.font = "30pt 'Azeret Mono'";
    let printableName = `@${name}`;
    let nameSize = ctx.measureText(printableName);
    while (nameSize.width > 500) {
      printableName =
        printableName.substring(0, printableName.length - 2) + '...';
      nameSize = ctx.measureText(printableName);
    }

    const usernamePadding = 20;
    // Username wrapper
    ctx.fillStyle = '#ffffff';
    roundRect(
      ctx,
      300 - Math.floor(nameSize.width / 2) - usernamePadding,
      412,
      nameSize.width + 2 * usernamePadding,
      50,
      12,
    );

    // Username
    ctx.fillStyle = '#000000';
    ctx.font = "30pt 'Azeret Mono'";
    ctx.fillText(printableName, 300 - Math.floor(nameSize.width / 2), 450);

    const avatarImg = await loadImage(avatar);
    ctx.drawImage(avatarImg, 125, 50, 350, 350);

    // Logo wrapper
    ctx.fillStyle = '#ffffff';
    roundRect(ctx, 250, 488, 100, 100, 50);

    const logoImg = await loadImage(
      `${__dirname}/../../images/twitter_logo.png`,
    );
    ctx.drawImage(logoImg, 260, 500, 80, 80);
    return canvas.toBuffer();
  }

  private async generateDiscordImage(
    avatar: string,
    username: string,
    discriminator: string,
    bg: string,
  ): Promise<Buffer> {
    this.logger.log('Generate Discord image');

    const canvas = createCanvas(600, 600);
    const ctx = canvas.getContext('2d');

    if (bg.indexOf('#') === 0) {
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, 600, 600);
    } else {
      const bgImage = await loadImage(`${__dirname}/../../images/${bg}.jpg`);
      ctx.drawImage(bgImage, 0, 0, 600, 600);
    }

    // Logo wrapper
    ctx.fillStyle = '#ffffff';
    roundRect(ctx, 250, 488, 100, 100, 50);

    ctx.fillStyle = '#000000';
    ctx.font = "30pt 'Azeret Mono'";

    let printableName = `${username}#${discriminator}`;
    let nameSize = ctx.measureText(printableName);
    if (nameSize.width > 500) {
      printableName = username;
      nameSize = ctx.measureText(printableName);
    }
    while (nameSize.width > 500) {
      printableName =
        printableName.substring(0, printableName.length - 2) + '...';
      nameSize = ctx.measureText(printableName);
    }

    const usernamePadding = 20;
    // Username wrapper
    ctx.fillStyle = '#ffffff';
    roundRect(
      ctx,
      300 - Math.floor(nameSize.width / 2) - usernamePadding,
      412,
      nameSize.width + 2 * usernamePadding,
      50,
      12,
    );

    // Username
    ctx.fillStyle = '#000000';
    ctx.font = "30pt 'Azeret Mono'";
    ctx.fillText(printableName, 300 - Math.floor(nameSize.width / 2), 450);

    const avatarImg = await loadImage(avatar);
    ctx.drawImage(avatarImg, 125, 50, 350, 350);

    const logoImg = await loadImage(
      `${__dirname}/../../images/discord_logo.png`,
    );
    ctx.drawImage(logoImg, 260, 500, 80, 80);
    return canvas.toBuffer();
  }
}
