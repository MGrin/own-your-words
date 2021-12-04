import { Injectable, Logger } from '@nestjs/common';
import { ethers } from 'ethers';
import { createCanvas, NodeCanvasRenderingContext2D, loadImage } from 'canvas';
import { abi } from '../../abi/OwnYourSocialNetwork.json';
import { EtherService } from '../ether/EtherService';
import { SocialNetwork } from './SocialNetwork';

export type OwnedAccount = {
  id: number;
  owner: string;
  sn_name: SocialNetwork;
  sn_id: string;
  sn_url: string;
};

const roundRect = (
  ctx: NodeCanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radiusSize: number,
) => {
  const radius = {
    tl: radiusSize,
    tr: radiusSize,
    br: radiusSize,
    bl: radiusSize,
  };

  ctx.beginPath();
  ctx.moveTo(x + radius.tl, y);
  ctx.lineTo(x + width - radius.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  ctx.lineTo(x + width, y + height - radius.br);
  ctx.quadraticCurveTo(
    x + width,
    y + height,
    x + width - radius.br,
    y + height,
  );
  ctx.lineTo(x + radius.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  ctx.lineTo(x, y + radius.tl);
  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  ctx.closePath();
  ctx.fill();
};

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

@Injectable()
export class OWSNService {
  private readonly logger: Logger = new Logger('TwitterAuthOracleService');

  private owsn: ethers.Contract;

  constructor(private readonly etherService: EtherService) {
    this.owsn = this.etherService.loadContract('OWSN', abi);
  }

  public async getOwnedAccountByToken(token: number): Promise<OwnedAccount> {
    this.logger.log(`Get owned account by token [token=${token}]`);

    const result = await this.owsn.getOwnedAccountByToken(token);
    const ownedAccount = {
      id: result.id.toNumber(),
      owner: result.owner,
      sn_id: result.sn_id,
      sn_name: result.sn_name,
      sn_url: result.sn_url,
    };

    return ownedAccount;
  }

  public async generateImage(ownedAccount: OwnedAccount): Promise<Buffer> {
    switch (ownedAccount.sn_name) {
      case SocialNetwork.twitter: {
        const urlSplitted = ownedAccount.sn_url.split('/');
        const screenName = urlSplitted[urlSplitted.length - 1];
        const avatar = `https://unavatar.io/twitter/${screenName}`;

        return await this.generateTwitterImage(avatar, screenName);
      }
      default: {
        throw new Error(`Unknown sn_name: ${ownedAccount.sn_name}`);
      }
    }
  }

  private async generateTwitterImage(
    avatar: string,
    name: string,
  ): Promise<Buffer> {
    const background = getRandomColor();
    const canvas = createCanvas(600, 600);

    const ctx = canvas.getContext('2d');
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, 600, 600);

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
