import { Injectable, Logger } from '@nestjs/common';
import { ethers } from 'ethers';
import { createCanvas, loadImage } from 'canvas';
import { EtherService } from '../ether/EtherService';
import { SocialNetwork } from '../owsn/SocialNetwork';
import { TwitterService } from '../twitter/TwitterService';
import { TwitterPost } from '../twitter/types';
import {
  getBackgroundColorForToken,
  roundRect,
  wrapText,
} from '../common/images';
import { OpenSeaMetadata } from '../common/types';
import { YandexObjectStorageService } from '../yandexObjectStorage/YandexObjectStorageService';
import { Bucket } from '../yandexObjectStorage/Bucket';

export type OwnedWords = {
  id: number;
  owner: string;
  sn_name: SocialNetwork;
  post_id: string;
  post_url: string;
};

export type OWWAttributes = {
  Background: string;
  'Social Network': string;
};

@Injectable()
export class OWWService {
  private readonly logger: Logger = new Logger('OWWService');

  private oww: ethers.Contract;

  constructor(
    private readonly etherService: EtherService,
    private readonly twitterService: TwitterService,
    private readonly yaStorage: YandexObjectStorageService,
  ) {
    this.oww = this.etherService.loadContract('OWW');
  }

  public async getOWWByTokenId(token: number): Promise<OwnedWords> {
    this.logger.log(`Get owned words by token [token=${token}]`);

    const result = await this.oww.getOWWByTokenId(token);
    const ownedWords = {
      id: result.id.toNumber(),
      owner: result.owner,
      post_id: result.post_id,
      sn_name: result.sn_name,
      post_url: result.post_url,
    };

    return ownedWords;
  }

  private getAttributes(ownedAccount: OwnedWords): OWWAttributes {
    return {
      Background: getBackgroundColorForToken(ownedAccount.id),
      'Social Network': ownedAccount.sn_name,
    };
  }

  public async getOpenSeaMetadata(
    ownedWords: OwnedWords,
  ): Promise<OpenSeaMetadata> {
    const attributes = this.getAttributes(ownedWords);
    let imageUrl = await this.yaStorage.get(Bucket.oww, `${ownedWords.id}.png`);
    if (!imageUrl) {
      const imageBuffer = await this.generateImage(ownedWords);
      imageUrl = await this.yaStorage.upload(
        Bucket.oww,
        `${ownedWords.id}.png`,
        imageBuffer,
      );
    }

    return {
      name: `${ownedWords.sn_name}:${ownedWords.post_id}`,
      description: `OWW Token for ${ownedWords.sn_name} account`,
      external_url: ownedWords.post_url,
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

  public async generateImage(ownedWords: OwnedWords): Promise<Buffer> {
    switch (ownedWords.sn_name) {
      case SocialNetwork.twitter: {
        const postId = ownedWords.post_id;
        const post = await this.twitterService.getPostById(postId);
        const user = await this.twitterService.getUserByScreenName(
          post.user.screen_name,
        );
        const avatar = user.profile_image_url_https;
        const attributes = this.getAttributes(ownedWords);
        return await this.generateTwitterImage(
          post,
          avatar,
          attributes.Background,
        );
      }
      default: {
        throw new Error(`Unknown sn_name: ${ownedWords.sn_name}`);
      }
    }
  }

  private async generateTwitterImage(
    post: TwitterPost,
    avatar: string,
    bg: string,
  ): Promise<Buffer> {
    const canvas = createCanvas(600, 600);

    // background
    const ctx = canvas.getContext('2d');
    if (bg.indexOf('#') === 0) {
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, 600, 600);
    } else {
      const bgImage = await loadImage(`${__dirname}/../../images/${bg}.jpg`);
      ctx.drawImage(bgImage, 0, 0, 600, 600);
    }

    // Post content
    ctx.fillStyle = '#ffffff';
    ctx.globalAlpha = 0.8;
    roundRect(ctx, 20, 160, 550, 350, 12);
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#000000';
    ctx.font = "35pt 'Azeret Mono'";
    wrapText(ctx, post.text, 30, 210, 490, 450, 45);

    // author logo
    ctx.fillStyle = '#ffffff';
    const authorImg = await loadImage(avatar);
    ctx.drawImage(authorImg, 25, 20, 100, 100);

    // Twitter logo
    ctx.fillStyle = '#ffffff';
    roundRect(ctx, 470, 15, 100, 100, 50);
    const logoImg = await loadImage(
      'https://cdn.cms-twdigitalassets.com/content/dam/developer-twitter/images/Twitter_logo_blue_48.png',
    );
    ctx.drawImage(logoImg, 480, 25, 80, 80);

    return canvas.toBuffer();
  }
}
