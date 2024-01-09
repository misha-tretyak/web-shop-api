import { CacheInterceptor } from '@nestjs/cache-manager';
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { Observable, of, tap } from 'rxjs';
import { CUSTOM_CACHE_KEY, CUSTOM_CACHE_TTL, IGNORE_CACHE } from '../constants/cache.constants';

export class CustomHttpCacheInterceptor extends CacheInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const httpContext = context.switchToHttp();
    const response = httpContext.getResponse();
    const key = this.trackBy(context);

    if (!key) {
      return next.handle();
    }

    const ttl = this.reflector.get<number>(CUSTOM_CACHE_TTL, context.getHandler());

    try {
      const value = await this.cacheManager.get(key);
      if (value) {
        response.header('X-Cache', 'HIT');
        return of(value);
      }
      return next.handle().pipe(
        tap(async (data) => {
          const args = ttl ? [key, data, { ttl }] : [key, data];
          await this.cacheManager.set(...args);
        })
      );
    } catch {
      return next.handle();
    }
  }

  trackBy(context: ExecutionContext): string | undefined {
    const http = context.switchToHttp();
    const request = http.getRequest();

    const needToIgnoreCache: boolean = this.reflector.get<boolean>(IGNORE_CACHE, context.getHandler());
    if (needToIgnoreCache || request.method !== 'GET') return undefined;

    const cacheKey: string | undefined = this.reflector.get<string>(CUSTOM_CACHE_KEY, context.getHandler());
    if (cacheKey) return cacheKey;

    return request.url;
  }
}
