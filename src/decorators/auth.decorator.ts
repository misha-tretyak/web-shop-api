import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { RoleEnum } from '@prisma/client';
import { AccessAuthGuard } from 'src/modules/auth/guards/access-auth.guard';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { ROLES_KEY } from 'src/shared/constants/roles.constants';

export function AuthWithRoles(roles?: RoleEnum[]) {
  return applyDecorators(SetMetadata(ROLES_KEY, roles), UseGuards(AccessAuthGuard, RolesGuard));
}
