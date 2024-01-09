import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BaseRepository } from '../../../shared/repositories/base.repository';
import { ErrorsHandleService } from '../../../shared/services/error.service';
import { PrismaService } from '../../../shared/services/prisma.service';
import { ImageWithRelations } from '../entities/image.entity';

@Injectable()
export class ImageRepository extends BaseRepository<
  ImageWithRelations,
  Prisma.ImageFindUniqueArgs,
  Prisma.ImageFindFirstArgs,
  Prisma.ImageFindManyArgs,
  Prisma.ImageCreateArgs,
  Prisma.ImageCreateManyArgs,
  Prisma.ImageUpdateArgs,
  Prisma.ImageUpdateManyArgs,
  Prisma.ImageUpsertArgs,
  Prisma.ImageDeleteArgs,
  Prisma.ImageDeleteManyArgs,
  Prisma.ImageCountArgs
> {
  constructor(prismaService: PrismaService, errorsHandleService: ErrorsHandleService) {
    super('Image', prismaService, errorsHandleService);
  }
}
