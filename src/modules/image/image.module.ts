import { Module } from '@nestjs/common';
import { ErrorsHandleService } from 'src/shared/services/error.service';
import { PrismaService } from 'src/shared/services/prisma.service';
import { ImageService } from './image.service';
import { ImageRepository } from './repositories/image.repository';
import { B2StorageService } from 'src/shared/services/b2-storage.service';

@Module({
  providers: [ImageService, B2StorageService, PrismaService, ImageRepository, ErrorsHandleService],
  exports: [ImageService],
})
export class ImageModule {}
