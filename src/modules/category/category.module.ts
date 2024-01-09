import { Module } from '@nestjs/common';
import { B2StorageService } from 'src/shared/services/b2-storage.service';
import { ErrorsHandleService } from 'src/shared/services/error.service';
import { PrismaService } from 'src/shared/services/prisma.service';
import { ImageModule } from '../image/image.module';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CategoryRepository } from './repositories/category.repository';

@Module({
  imports: [ImageModule],
  controllers: [CategoryController],
  providers: [CategoryService, PrismaService, B2StorageService, CategoryRepository, ErrorsHandleService],
})
export class CategoryModule {}
