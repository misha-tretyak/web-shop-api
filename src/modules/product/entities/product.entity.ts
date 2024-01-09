import { Category, Image, OrderItem, Product, Review } from '@prisma/client';

export type ProductWithRelations = Product & {
  categories?: Category[];
  reviews?: Review[];
  images?: Image[];
  orderItems?: OrderItem[];
};
