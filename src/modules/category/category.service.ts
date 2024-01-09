import { BadRequestException, Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { B2StorageService } from 'src/shared/services/b2-storage.service';
import { UtilsService } from 'src/shared/utils/utils.service';
import { ImageService } from '../image/image.service';
import { CategoryCreateDto } from './dto/category-create.dto';
import { CategoryUpdateDto } from './dto/category-update.dto';
import { CategoryWithRelations } from './entities/category.entity';
import { CategoryRepository } from './repositories/category.repository';

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly b2StorageService: B2StorageService,
    private readonly imageService: ImageService,
    private readonly logger: PinoLogger
  ) {
    this.logger.setContext(CategoryService.name);
  }

  findMany(): Promise<CategoryWithRelations[] | null> {
    return this.categoryRepository.findMany({
      include: {
        images: true,
      },
    });
  }

  async create(categoryCreateDto: CategoryCreateDto, files: Express.Multer.File[]) {
    delete categoryCreateDto.files;
    const uploadedFiles = await Promise.all(files.map((file) => this.b2StorageService.uploadFile(file)));
    const category = await this.categoryRepository.create({
      data: {
        ...categoryCreateDto,
        images: {
          create: uploadedFiles,
        },
      },
      include: {
        images: true,
      },
    });

    return category;
  }

  async update(categoryUpdateDto: CategoryUpdateDto, files?: Express.Multer.File[]) {
    delete categoryUpdateDto.files;
    let { categoryUuid, imagesUuidsToRemove, ...categoryUpdateData } = categoryUpdateDto;

    const category = await this.categoryRepository.findOneAndThrowIfNotExist({
      where: { categoryUuid },
      include: {
        images: true,
      },
    });

    if (imagesUuidsToRemove) imagesUuidsToRemove = UtilsService.validateArrayOfUuids(imagesUuidsToRemove);

    const totalCountOfImages = (category.images.length || 0 + files?.length || 0) - imagesUuidsToRemove?.length || 0;
    if (totalCountOfImages > 10) throw new BadRequestException('Allowed count of category images is 10!');
    if (imagesUuidsToRemove?.length) await this.imageService.deleteByImageUuids(imagesUuidsToRemove);
    if (files?.length) {
      const uploadedFiles = await Promise.all(files.map((file) => this.b2StorageService.uploadFile(file)));
      await Promise.all(
        uploadedFiles.map((file) => this.imageService.create({ ...file, category: { connect: { categoryUuid } } }))
      );
    }

    const updatedCategory = await this.categoryRepository.update({
      where: { categoryUuid },
      data: {
        ...categoryUpdateData,
      },
      include: {
        images: true,
      },
    });

    return updatedCategory;
  }

  async delete(categoryUuid: string) {
    const category = await this.categoryRepository.findOneAndThrowIfNotExist({
      where: { categoryUuid },
      include: {
        images: true,
      },
    });

    if (category.images.length) await this.imageService.deleteByCategoryUuid(categoryUuid);

    const result = await this.categoryRepository.delete({ where: { categoryUuid } });

    return result;
  }
}
