import { SetMetadata } from '@nestjs/common';
import { CUSTOM_CACHE_KEY, CUSTOM_CACHE_TTL, IGNORE_CACHE } from '../shared/constants/cache.constants';

export const SetIgnoreCache = () => SetMetadata(IGNORE_CACHE, true);
export const SetCacheKey = (key: string) => SetMetadata(CUSTOM_CACHE_KEY, key);
export const SetCacheTTL = (ttl: number) => SetMetadata(CUSTOM_CACHE_TTL, ttl);
