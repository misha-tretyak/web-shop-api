import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerModule } from 'nestjs-pino';
import { envConfiguration } from './config/env.config';
import { pinoConfigFactory } from './config/pino.config';
import { AuthModule } from './modules/auth/auth.module';
import { CategoryModule } from './modules/category/category.module';
import { OrderModule } from './modules/order/order.module';
import { ProductModule } from './modules/product/product.module';
import { UserModule } from './modules/user/user.module';
import { CustomHttpCacheInterceptor } from './shared/interceptors/httpCache.interceptor';
import { CacheConfigService } from './shared/services/cache.service';
import { PrismaService } from './shared/services/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envConfiguration,
    }),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: pinoConfigFactory,
    }),
    CacheModule.registerAsync({
      useClass: CacheConfigService,
    }),
    UserModule,
    CategoryModule,
    ProductModule,
    OrderModule,
    AuthModule,
  ],
  providers: [
    PrismaService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CustomHttpCacheInterceptor,
    },
  ],
})
export class AppModule {}
