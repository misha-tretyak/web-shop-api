import { Category, Image, Product, User } from '@prisma/client';

export type ImageWithRelations = Image & {
  product?: Product;
  category?: Category;
  user?: User;
};
