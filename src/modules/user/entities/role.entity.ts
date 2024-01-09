import { Role, User } from '@prisma/client';

export type RoleWithRelations = Role & {
  users: User[];
};
