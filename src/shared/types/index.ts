import { ApiProperty } from '@nestjs/swagger';
import type { Store } from 'cache-manager';
import { IsNumber, IsOptional } from 'class-validator';

export type RedisCacheManager<S extends Store = Store> = {
  set: (key: string, value: unknown, { ttl }?: { ttl: number }) => Promise<void>;
  get: <T>(key: string) => Promise<T | undefined>;
  del: (key: string) => Promise<void>;
  reset: () => Promise<void>;
  store: S;
};

export type ErrorType = {
  message: string;
  code: string;
};

export class FindManyPaginationDto {
  @ApiProperty({
    required: false,
    default: 1,
  })
  @IsOptional()
  @IsNumber()
  page?: number;

  @ApiProperty({
    required: false,
    default: 20,
  })
  @IsOptional()
  @IsNumber()
  perPage?: number;
}
