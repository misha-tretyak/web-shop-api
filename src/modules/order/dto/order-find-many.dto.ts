import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';
import { FindManyPaginationDto } from 'src/shared/types';

export class OrderFindManyDto extends FindManyPaginationDto {
  @ApiProperty({
    required: false,
    default: Prisma.ProductScalarFieldEnum.createdAt,
  })
  @IsOptional()
  @IsEnum(Prisma.ProductScalarFieldEnum)
  sortField?: Prisma.ProductScalarFieldEnum;

  @ApiProperty({
    required: false,
    default: Prisma.SortOrder.asc,
  })
  @IsOptional()
  @IsEnum(Prisma.SortOrder)
  sortOrder?: Prisma.SortOrder;
}
