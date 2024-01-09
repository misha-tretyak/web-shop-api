import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BaseRepository } from '../../../shared/repositories/base.repository';
import { ErrorsHandleService } from '../../../shared/services/error.service';
import { PrismaService } from '../../../shared/services/prisma.service';
import { CategoryWithRelations } from '../entities/category.entity';

@Injectable()
export class CategoryRepository extends BaseRepository<
  CategoryWithRelations,
  Prisma.CategoryFindUniqueArgs,
  Prisma.CategoryFindFirstArgs,
  Prisma.CategoryFindManyArgs,
  Prisma.CategoryCreateArgs,
  Prisma.CategoryCreateManyArgs,
  Prisma.CategoryUpdateArgs,
  Prisma.CategoryUpdateManyArgs,
  Prisma.CategoryUpsertArgs,
  Prisma.CategoryDeleteArgs,
  Prisma.CategoryDeleteManyArgs,
  Prisma.CategoryCountArgs
> {
  constructor(prismaService: PrismaService, errorsHandleService: ErrorsHandleService) {
    super('Category', prismaService, errorsHandleService);
  }
}
