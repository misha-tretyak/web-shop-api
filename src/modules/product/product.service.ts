import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PinoLogger } from 'nestjs-pino';
import { PaginatedResult } from 'src/shared/repositories/base.repository';
import { B2StorageService } from 'src/shared/services/b2-storage.service';
import { UtilsService } from 'src/shared/utils/utils.service';
import { CategoryRepository } from '../category/repositories/category.repository';
import { ImageService } from '../image/image.service';
import { ProductAddReviewDto } from './dto/product-add-review.dto';
import { ProductCreateDto } from './dto/product-create.dto';
import { FindManyProductsDto } from './dto/product-find-many.dto';
import { ProductUpdateDto } from './dto/product-update.dto';
import { ProductWithRelations } from './entities/product.entity';
import { ProductRepository } from './repositories/product.repository';
import { ReviewRepository } from './repositories/review.repository';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly reviewRepository: ReviewRepository,
    private readonly b2StorageService: B2StorageService,
    private readonly imageService: ImageService,
    private readonly logger: PinoLogger
  ) {
    this.logger.setContext(ProductService.name);
  }

  findMany(dto: FindManyProductsDto): Promise<PaginatedResult<ProductWithRelations>> {
    const { sortField, sortOrder, page, perPage } = dto;
    const orderBy = sortField && sortOrder ? { [sortField]: sortOrder } : {};
    const where: Prisma.ProductWhereInput = {};

    if (dto.priceFrom !== undefined || dto.priceTo !== undefined) {
      where['price'] = {};
      if (dto.priceFrom !== undefined) {
        where.price['gte'] = dto.priceFrom;
      }
      if (dto.priceTo !== undefined) {
        where.price['lte'] = dto.priceTo;
      }
    }

    if (dto.color) {
      where['color'] = {
        equals: dto.color,
        mode: 'insensitive',
      };
    }

    if (dto.searchForName) {
      where['name'] = {
        contains: dto.searchForName,
        mode: 'insensitive',
      };
    }

    if (dto.categoryUuids) {
      const categoryUuids = UtilsService.validateArrayOfUuids(dto.categoryUuids);

      where['categories'] = {
        some: {
          categoryUuid: {
            in: categoryUuids,
          },
        },
      };
    }

    return this.productRepository.findManyAndPaginate(
      { page, perPage },
      { where, orderBy, include: { images: true, categories: true } }
    );
  }

  async create(productCreateDto: ProductCreateDto, files: Express.Multer.File[]) {
    let { categoryUuids, ...productCreateData } = productCreateDto;

    if (categoryUuids) {
      categoryUuids = UtilsService.validateArrayOfUuids(categoryUuids);
      await Promise.all(
        categoryUuids.map((categoryUuid) =>
          this.categoryRepository.findOneAndThrowIfNotExist({ where: { categoryUuid } })
        )
      );
    }

    const uploadedFiles = await Promise.all(files.map((file) => this.b2StorageService.uploadFile(file)));
    const product = await this.productRepository.create({
      data: {
        ...productCreateData,
        categories: {
          connect: categoryUuids.map((categoryUuid) => {
            return { categoryUuid };
          }),
        },
        images: {
          create: uploadedFiles,
        },
      },
      include: {
        images: true,
        categories: true,
        reviews: true,
      },
    });

    return product;
  }

  async update(productUpdateDto: ProductUpdateDto, files?: Express.Multer.File[]) {
    delete productUpdateDto.files;
    let { productUuid, categoryUuids, imagesUuidsToRemove, ...productUpdateData } = productUpdateDto;

    const product = await this.productRepository.findOneByUniqueField({
      where: { productUuid },
      include: {
        images: true,
        categories: true,
        reviews: true,
      },
    });

    if (imagesUuidsToRemove) imagesUuidsToRemove = UtilsService.validateArrayOfUuids(imagesUuidsToRemove);
    if (categoryUuids) categoryUuids = UtilsService.validateArrayOfUuids(categoryUuids);

    const totalCountOfImages = (product.images.length || 0 + files?.length || 0) - imagesUuidsToRemove?.length || 0;
    if (totalCountOfImages > 10) throw new BadRequestException('Allowed count of product images is 10!');
    if (imagesUuidsToRemove?.length) await this.imageService.deleteByImageUuids(imagesUuidsToRemove);
    if (files?.length) {
      const uploadedFiles = await Promise.all(files.map((file) => this.b2StorageService.uploadFile(file)));
      await Promise.all(
        uploadedFiles.map((file) => this.imageService.create({ ...file, product: { connect: { productUuid } } }))
      );
    }

    const currentCategoryUuids = product.categories?.map((category) => category?.categoryUuid);
    const categoriesToConnect = categoryUuids?.length
      ? categoryUuids
          ?.filter((categoryUuid) => !currentCategoryUuids?.includes(categoryUuid))
          ?.map((categoryUuid) => ({ categoryUuid }))
      : undefined;

    const categoriesToDisconnect = categoryUuids?.length
      ? currentCategoryUuids
          ?.filter((categoryUuid) => !categoryUuids?.includes(categoryUuid))
          ?.map((categoryUuid) => ({ categoryUuid }))
      : undefined;

    const updatedProduct = await this.productRepository.update({
      where: { productUuid },
      data: {
        ...productUpdateData,
        categories: {
          connect: categoriesToConnect,
          disconnect: categoriesToDisconnect,
        },
      },
      include: {
        images: true,
        categories: true,
        reviews: true,
      },
    });

    return updatedProduct;
  }

  async addReview(productAddReviewDto: ProductAddReviewDto, userUuid: string) {
    await this.productRepository.findOneAndThrowIfNotExist({
      where: { productUuid: productAddReviewDto.productUuid },
    });

    await this.reviewRepository.create({
      data: {
        rating: productAddReviewDto.rating,
        comment: productAddReviewDto.comment,
        user: { connect: { userUuid } },
        product: { connect: { productUuid: productAddReviewDto.productUuid } },
      },
    });

    const productWithReviews = await this.productRepository.findOneByUniqueField({
      where: { productUuid: productAddReviewDto.productUuid },
      include: {
        reviews: true,
        images: true,
        categories: true,
      },
    });

    return productWithReviews;
  }

  async delete(productUuid: string) {
    const product = await this.productRepository.findOneAndThrowIfNotExist({
      where: { productUuid },
      include: {
        images: true,
        categories: true,
        reviews: true,
      },
    });

    if (product.images.length) await this.imageService.deleteByProductUuid(productUuid);

    const result = await this.productRepository.delete({ where: { productUuid } });

    return result;
  }
}
