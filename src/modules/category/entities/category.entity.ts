import { Category, Image, Product } from '@prisma/client';

export type CategoryWithRelations = Category & {
  products?: Product[];
  images?: Image[];
};
