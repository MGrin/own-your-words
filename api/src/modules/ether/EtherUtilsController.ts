import { Body, Controller, Post } from '@nestjs/common';
import { EtherService } from './EtherService';

@Controller('utils')
export class EtherUtilsController {
  constructor(private readonly etherService: EtherService) {}

  @Post('encrypt')
  public async encrypt(@Body() data: any) {
    if (typeof data === 'string') {
      return {
        encrypted: this.etherService.encrypt(data),
      };
    }

    if (Array.isArray(data)) {
      return {
        encrypted: data.map((datum) => this.etherService.encrypt(datum)),
      };
    }

    if (typeof data === 'object') {
      const encrypted = {};
      const keys = Object.keys(data);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const value = data[key];
        encrypted[key] = this.etherService.encrypt(value);
      }

      return {
        encrypted,
      };
    }

    throw new Error('Unsupported data type');
  }
}
