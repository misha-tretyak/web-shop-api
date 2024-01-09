import { Module } from '@nestjs/common';
import { ErrorsHandleService } from 'src/shared/services/error.service';
import { PrismaService } from 'src/shared/services/prisma.service';
import { ProductRepository } from '../product/repositories/product.repository';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderRepository } from './repositories/order.repository';

@Module({
  controllers: [OrderController],
  providers: [OrderService, PrismaService, OrderRepository, ProductRepository, ErrorsHandleService],
})
export class OrderModule {}
