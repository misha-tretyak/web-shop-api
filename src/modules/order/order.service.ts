import { Injectable } from '@nestjs/common';
import { OrderStatusEnum } from '@prisma/client';
import { PinoLogger } from 'nestjs-pino';
import { ProductRepository } from '../product/repositories/product.repository';
import { OrderCreateDto } from './dto/order-create.dto';
import { OrderFindManyDto } from './dto/order-find-many.dto';
import { OrderRepository } from './repositories/order.repository';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly productRepository: ProductRepository,
    private readonly logger: PinoLogger
  ) {
    this.logger.setContext(OrderService.name);
  }

  findMany(orderFindManyDto: OrderFindManyDto, userUuid: string) {
    const { sortField, sortOrder, page, perPage } = orderFindManyDto;
    const orderBy = sortField && sortOrder ? { [sortField]: sortOrder } : {};

    return this.orderRepository.findManyAndPaginate(
      { page, perPage },
      {
        where: { userUuid },
        orderBy,
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
        },
      }
    );
  }

  async create(orderCreateDto: OrderCreateDto, userUuid: string) {
    await Promise.all(
      orderCreateDto.orderItems.map((orderItem) =>
        this.productRepository.findOneAndThrowIfNotExist({ where: { productUuid: orderItem.productUuid } })
      )
    );

    const products = await this.productRepository.findMany({
      where: { productUuid: { in: orderCreateDto.orderItems.map((orderItem) => orderItem.productUuid) } },
    });

    const totalPrice = products.reduce((total, product) => {
      const price = parseFloat(product.price.toString());
      const orderItem = orderCreateDto.orderItems.find((item) => item.productUuid === product.productUuid);
      const quantity = orderItem ? orderItem.quantity : 0;
      const productTotal = price * quantity;

      return total + productTotal;
    }, 0);

    const roundedTotalPrice = Math.round(totalPrice * 100) / 100;

    const orderItems = orderCreateDto.orderItems.map((orderItem) => {
      const product = products.find((product) => product.productUuid === orderItem.productUuid);
      const totalPriceForQuantity = Math.round(parseFloat(product.price.toString()) * orderItem.quantity * 100) / 100;

      return {
        price: totalPriceForQuantity,
        quantity: orderItem.quantity,
        product: { connect: { productUuid: orderItem.productUuid } },
      };
    });

    const order = await this.orderRepository.create({
      data: {
        totalPrice: roundedTotalPrice,
        status: OrderStatusEnum.PENDING,
        user: {
          connect: { userUuid },
        },
        orderItems: {
          create: orderItems,
        },
      },
      include: {
        orderItems: { include: { product: true } },
      },
    });

    return order;
  }
}
