import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsEnum, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { FindManyPaginationDto } from 'src/shared/types';

export class FindManyProductsDto extends FindManyPaginationDto {
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

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsNumber()
  priceFrom?: number;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsNumber()
  priceTo?: number;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiProperty({ type: 'array', items: { type: 'string', format: 'uuid' }, required: false })
  @IsUUID(4, { each: true })
  @IsOptional()
  categoryUuids?: string[];

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  searchForName?: string;
}
