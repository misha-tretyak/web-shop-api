import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BaseRepository } from '../../../shared/repositories/base.repository';
import { ErrorsHandleService } from '../../../shared/services/error.service';
import { PrismaService } from '../../../shared/services/prisma.service';
import { OrderItemWithRelations } from '../entities/orderItem.entity';

@Injectable()
export class OrderItemRepository extends BaseRepository<
  OrderItemWithRelations,
  Prisma.OrderItemFindUniqueArgs,
  Prisma.OrderItemFindFirstArgs,
  Prisma.OrderItemFindManyArgs,
  Prisma.OrderItemCreateArgs,
  Prisma.OrderItemCreateManyArgs,
  Prisma.OrderItemUpdateArgs,
  Prisma.OrderItemUpdateManyArgs,
  Prisma.OrderItemUpsertArgs,
  Prisma.OrderItemDeleteArgs,
  Prisma.OrderItemDeleteManyArgs,
  Prisma.OrderItemCountArgs
> {
  constructor(prismaService: PrismaService, errorsHandleService: ErrorsHandleService) {
    super('OrderItem', prismaService, errorsHandleService);
  }
}
