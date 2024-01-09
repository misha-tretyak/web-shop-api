import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PinoLogger } from 'nestjs-pino';
import { B2StorageService } from 'src/shared/services/b2-storage.service';
import { ImageRepository } from './repositories/image.repository';

@Injectable()
export class ImageService {
  constructor(
    private readonly imageRepository: ImageRepository,
    private readonly b2StorageService: B2StorageService,
    private readonly logger: PinoLogger
  ) {
    this.logger.setContext(ImageService.name);
  }

  async create(createImageDto: Prisma.ImageCreateInput) {
    const image = await this.imageRepository.create({ data: createImageDto });

    return image;
  }

  async deleteByProductUuid(productUuid: string) {
    const images = await this.imageRepository.findMany({ where: { productUuid } });
    await Promise.all(images.map((file) => this.b2StorageService.deleteFile(file.fileId, file.filename)));

    return await this.imageRepository.deleteMany({ where: { productUuid } });
  }

  async deleteByCategoryUuid(categoryUuid: string) {
    const images = await this.imageRepository.findMany({ where: { categoryUuid } });
    await Promise.all(images.map((file) => this.b2StorageService.deleteFile(file.fileId, file.filename)));

    return await this.imageRepository.deleteMany({ where: { categoryUuid } });
  }

  async deleteByImageUuids(imageUuids: string | string[]) {
    const imagUuidsArray = !Array.isArray(imageUuids) ? [imageUuids] : imageUuids;

    const images = await this.imageRepository.findMany({ where: { imageUuid: { in: imagUuidsArray } } });
    await Promise.all(images.map((file) => this.b2StorageService.deleteFile(file.fileId, file.filename)));

    return await this.imageRepository.deleteMany({ where: { imageUuid: { in: imagUuidsArray } } });
  }
}
