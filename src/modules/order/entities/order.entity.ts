import { Order, OrderItem, User } from '@prisma/client';

export type OrderWithRelations = Order & {
  user: User;
  orderItems: OrderItem[];
};
