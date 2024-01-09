import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BaseRepository } from '../../../shared/repositories/base.repository';
import { ErrorsHandleService } from '../../../shared/services/error.service';
import { PrismaService } from '../../../shared/services/prisma.service';
import { UserWithRelations } from '../entities/user.entity';

@Injectable()
export class UserRepository extends BaseRepository<
  UserWithRelations,
  Prisma.UserFindUniqueArgs,
  Prisma.UserFindFirstArgs,
  Prisma.UserFindManyArgs,
  Prisma.UserCreateArgs,
  Prisma.UserCreateManyArgs,
  Prisma.UserUpdateArgs,
  Prisma.UserUpdateManyArgs,
  Prisma.UserUpsertArgs,
  Prisma.UserDeleteArgs,
  Prisma.UserDeleteManyArgs,
  Prisma.UserCountArgs
> {
  constructor(prismaService: PrismaService, errorsHandleService: ErrorsHandleService) {
    super('User', prismaService, errorsHandleService);
  }

  async getUserByAnyCaseEmail(email: string): Promise<UserWithRelations> {
    return this.findOneWithoutChecking({
      where: {
        email: {
          equals: email,
          mode: 'insensitive',
        },
      },
      include: {
        roles: true,
        address: true,
        orders: true,
        reviews: true,
      },
    });
  }
}
