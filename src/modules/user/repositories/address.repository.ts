import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BaseRepository } from '../../../shared/repositories/base.repository';
import { ErrorsHandleService } from '../../../shared/services/error.service';
import { PrismaService } from '../../../shared/services/prisma.service';
import { AddressWithRelations } from '../entities/address.entity';

@Injectable()
export class AddressRepository extends BaseRepository<
  AddressWithRelations,
  Prisma.AddressFindUniqueArgs,
  Prisma.AddressFindFirstArgs,
  Prisma.AddressFindManyArgs,
  Prisma.AddressCreateArgs,
  Prisma.AddressCreateManyArgs,
  Prisma.AddressUpdateArgs,
  Prisma.AddressUpdateManyArgs,
  Prisma.AddressUpsertArgs,
  Prisma.AddressDeleteArgs,
  Prisma.AddressDeleteManyArgs,
  Prisma.AddressCountArgs
> {
  constructor(prismaService: PrismaService, errorsHandleService: ErrorsHandleService) {
    super('Address', prismaService, errorsHandleService);
  }
}
