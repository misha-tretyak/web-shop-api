import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BaseRepository } from '../../../shared/repositories/base.repository';
import { ErrorsHandleService } from '../../../shared/services/error.service';
import { PrismaService } from '../../../shared/services/prisma.service';
import { ReviewWithRelations } from '../entities/review.entity';

@Injectable()
export class ReviewRepository extends BaseRepository<
  ReviewWithRelations,
  Prisma.ReviewFindUniqueArgs,
  Prisma.ReviewFindFirstArgs,
  Prisma.ReviewFindManyArgs,
  Prisma.ReviewCreateArgs,
  Prisma.ReviewCreateManyArgs,
  Prisma.ReviewUpdateArgs,
  Prisma.ReviewUpdateManyArgs,
  Prisma.ReviewUpsertArgs,
  Prisma.ReviewDeleteArgs,
  Prisma.ReviewDeleteManyArgs,
  Prisma.ReviewCountArgs
> {
  constructor(prismaService: PrismaService, errorsHandleService: ErrorsHandleService) {
    super('Review', prismaService, errorsHandleService);
  }
}
