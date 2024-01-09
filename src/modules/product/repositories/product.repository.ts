import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BaseRepository } from '../../../shared/repositories/base.repository';
import { ErrorsHandleService } from '../../../shared/services/error.service';
import { PrismaService } from '../../../shared/services/prisma.service';
import { ProductWithRelations } from '../entities/product.entity';

@Injectable()
export class ProductRepository extends BaseRepository<
  ProductWithRelations,
  Prisma.ProductFindUniqueArgs,
  Prisma.ProductFindFirstArgs,
  Prisma.ProductFindManyArgs,
  Prisma.ProductCreateArgs,
  Prisma.ProductCreateManyArgs,
  Prisma.ProductUpdateArgs,
  Prisma.ProductUpdateManyArgs,
  Prisma.ProductUpsertArgs,
  Prisma.ProductDeleteArgs,
  Prisma.ProductDeleteManyArgs,
  Prisma.ProductCountArgs
> {
  constructor(prismaService: PrismaService, errorsHandleService: ErrorsHandleService) {
    super('Product', prismaService, errorsHandleService);
  }
}
