import { Injectable } from '@nestjs/common';
import { Prisma, RoleEnum } from '@prisma/client';
import { BaseRepository } from '../../../shared/repositories/base.repository';
import { ErrorsHandleService } from '../../../shared/services/error.service';
import { PrismaService } from '../../../shared/services/prisma.service';
import { RoleWithRelations } from '../entities/role.entity';

@Injectable()
export class RoleRepository extends BaseRepository<
  RoleWithRelations,
  Prisma.RoleFindUniqueArgs,
  Prisma.RoleFindFirstArgs,
  Prisma.RoleFindManyArgs,
  Prisma.RoleCreateArgs,
  Prisma.RoleCreateManyArgs,
  Prisma.RoleUpdateArgs,
  Prisma.RoleUpdateManyArgs,
  Prisma.RoleUpsertArgs,
  Prisma.RoleDeleteArgs,
  Prisma.RoleDeleteManyArgs,
  Prisma.RoleCountArgs
> {
  constructor(prismaService: PrismaService, errorsHandleService: ErrorsHandleService) {
    super('Role', prismaService, errorsHandleService);
  }

  async getRoleByName(name: RoleEnum): Promise<RoleWithRelations> {
    return this.findOneWithoutChecking({
      where: {
        name,
      },
    });
  }
}
