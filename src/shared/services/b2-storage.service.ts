import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import * as B2 from 'backblaze-b2';
import { PinoLogger } from 'nestjs-pino';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class B2StorageService {
  private b2Storage: B2;

  constructor(
    private configService: ConfigService,
    private readonly logger: PinoLogger
  ) {
    this.logger.setContext(B2StorageService.name);
    this.b2Storage = new B2({
      applicationKeyId: this.configService.get<string>('B2_APPLICATION_KEY_ID'),
      applicationKey: this.configService.get<string>('B2_APPLICATION_KEY'),
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<Prisma.ImageCreateInput> {
    await this.b2Storage.authorize();
    const uniqueFilename = this.generateUniqueFilename(file.originalname);

    const uploadUrl = await this.b2Storage.getUploadUrl({ bucketId: this.configService.get<string>('B2_BUCKET_ID') });
    const uploadResponse = await this.b2Storage.uploadFile({
      uploadUrl: uploadUrl.data.uploadUrl,
      uploadAuthToken: uploadUrl.data.authorizationToken,
      fileName: uniqueFilename,
      data: file.buffer,
    });

    return {
      source: `${this.configService.get<string>('B2_DOMAIN')}/${uploadResponse.data.fileName}`,
      filename: uniqueFilename,
      fileId: uploadResponse.data.fileId,
      originalFilename: file.originalname,
      mimetype: path.extname(file.originalname),
    };
  }

  async deleteFile(fileId: string, fileName: string): Promise<void> {
    await this.b2Storage.authorize();

    const response = await this.b2Storage.deleteFileVersion({
      fileName,
      fileId,
    });

    console.log('DELETE FIE RES: ', response.data);

    return response.data;
  }

  generateUniqueFilename(originalFilename: string): string {
    const fileExtension = path.extname(originalFilename);
    const uniqueId = uuidv4();
    const timestamp = Date.now();

    return `${uniqueId}-${timestamp}${fileExtension}`;
  }
}
