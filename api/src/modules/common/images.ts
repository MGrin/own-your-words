import { NodeCanvasRenderingContext2D } from 'canvas';
import COLORS from './colors';

export const roundRect = (
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

export const wrapText = (
  ctx: NodeCanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  maxHeight: number,
  lineHeight: number,
) => {
  const words = text.split(/[ \n]/);
  let line = '';

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;

    if (y > maxHeight) {
      break;
    }
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, y);
      line = words[n] + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);
};

export enum BACKGROUND_IMAGES {
  whiteBrickWall = 'white_brick_wall',
  redBrickWall = 'red_brick_wall',
  blackBrickWall = 'black_brick_wall',
  woodWall = 'wood_wall',
  cyberpunk = 'cyberpunk',
  punk = 'punk',
  graffiti = 'graffiti',
  sky = 'sky',
  ocean = 'ocean',
  space = 'space',
}

export const getBackgroundColorForToken = (originalToken: number) => {
  let token = originalToken;
  if (process.env.NODE_ENV === 'local') {
    token = Math.floor(Math.random() * 1000);
  }

  if (token % 7 === 0) {
    return BACKGROUND_IMAGES.ocean;
  }
  if (token % 11 === 0) {
    return BACKGROUND_IMAGES.sky;
  }
  if (token % 13 === 0) {
    return BACKGROUND_IMAGES.redBrickWall;
  }
  if (token % 17 === 0) {
    return BACKGROUND_IMAGES.whiteBrickWall;
  }
  if (token % 19 === 0) {
    return BACKGROUND_IMAGES.blackBrickWall;
  }
  if (token % 23 === 0) {
    return BACKGROUND_IMAGES.woodWall;
  }
  if (token % 29 === 0) {
    return BACKGROUND_IMAGES.punk;
  }
  if (token % 31 === 0) {
    return BACKGROUND_IMAGES.graffiti;
  }
  if (token % 37 === 0) {
    return BACKGROUND_IMAGES.space;
  }
  if (token % 41 === 0) {
    return BACKGROUND_IMAGES.cyberpunk;
  }

  const colorNames = Object.keys(COLORS);
  const colorName = colorNames[token % colorNames.length];
  return COLORS[colorName];
};
