import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BaseRepository } from '../../../shared/repositories/base.repository';
import { ErrorsHandleService } from '../../../shared/services/error.service';
import { PrismaService } from '../../../shared/services/prisma.service';
import { OrderWithRelations } from '../entities/order.entity';

@Injectable()
export class OrderRepository extends BaseRepository<
  OrderWithRelations,
  Prisma.OrderFindUniqueArgs,
  Prisma.OrderFindFirstArgs,
  Prisma.OrderFindManyArgs,
  Prisma.OrderCreateArgs,
  Prisma.OrderCreateManyArgs,
  Prisma.OrderUpdateArgs,
  Prisma.OrderUpdateManyArgs,
  Prisma.OrderUpsertArgs,
  Prisma.OrderDeleteArgs,
  Prisma.OrderDeleteManyArgs,
  Prisma.OrderCountArgs
> {
  constructor(prismaService: PrismaService, errorsHandleService: ErrorsHandleService) {
    super('Order', prismaService, errorsHandleService);
  }
}
