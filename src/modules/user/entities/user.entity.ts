import { Address, Order, Review, Role, User } from '@prisma/client';

export type UserWithRelations = User & {
  address?: Address;
  orders?: Order[];
  roles?: Role[];
  reviews?: Review[];
};
