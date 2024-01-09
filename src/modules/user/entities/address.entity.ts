import { Address, User } from '@prisma/client';

export type AddressWithRelations = Address & {
  user: User;
};
