import { Module } from '@nestjs/common';
import { B2StorageService } from 'src/shared/services/b2-storage.service';
import { ErrorsHandleService } from 'src/shared/services/error.service';
import { PrismaService } from 'src/shared/services/prisma.service';
import { CategoryRepository } from '../category/repositories/category.repository';
import { ImageModule } from '../image/image.module';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductRepository } from './repositories/product.repository';
import { ReviewRepository } from './repositories/review.repository';

@Module({
  imports: [ImageModule],
  controllers: [ProductController],
  providers: [
    ProductService,
    PrismaService,
    B2StorageService,
    ProductRepository,
    ReviewRepository,
    CategoryRepository,
    ErrorsHandleService,
  ],
})
export class ProductModule {}
