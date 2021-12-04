import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { Bucket } from './Bucket';

@Injectable()
export class YandexObjectStorageService {
  private aws: S3;
  private network: string;

  constructor(private readonly configs: ConfigService) {
    const accessKeyId = configs.get<string>('YA_STORAGE_ACCESS_KEY');
    const secretAccessKey = configs.get<string>('YA_STORAGE_SECRET_KEY');

    this.network = configs.get<string>('NETWORK');

    this.aws = new S3({
      endpoint: 'https://storage.yandexcloud.net',
      accessKeyId,
      secretAccessKey,
      region: 'ru-central1',
      httpOptions: {
        timeout: 10000,
        connectTimeout: 10000,
      },
    });
  }

  public async get(bucket: Bucket, key: string): Promise<string | undefined> {
    const params = {
      Bucket: bucket,
      Key: key,
    };

    const result: any = await new Promise((resolve, reject) => {
      this.aws.headObject(params, (err) => {
        if (err) return reject(err);

        return resolve(
          `https://${bucket}-${this.network}.storage.yandexcloud.net/${key}`,
        );
      });
    });

    return result;
  }

  public async upload(
    bucket: Bucket,
    key: string,
    content: Buffer,
  ): Promise<string> {
    const params = {
      Bucket: `${bucket}-${this.network}`,
      Key: key,
      Body: content,
      ContentType: 'text/plain',
    };

    const result: any = await new Promise((resolve, reject) => {
      this.aws.upload(params, (err, data) => {
        if (err) return reject(err);
        return resolve(data);
      });
    });

    return result.Location;
  }
}
