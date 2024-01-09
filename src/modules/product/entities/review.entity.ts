import { Product, Review, User } from '@prisma/client';

export type ReviewWithRelations = Review & {
  product: Product;
  user: User;
};
