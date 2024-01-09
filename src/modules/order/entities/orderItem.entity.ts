import { Order, OrderItem, Product } from '@prisma/client';

export type OrderItemWithRelations = OrderItem & {
  order: Order;
  product: Product;
};
