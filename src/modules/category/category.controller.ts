import {
  Body,
  Controller,
  Delete,
  HttpException,
  HttpStatus,
  ParseFilePipeBuilder,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';
import { RoleEnum } from '@prisma/client';
import { AuthWithRoles } from 'src/decorators/auth.decorator';
import { SetIgnoreCache } from 'src/decorators/cache.decorator';
import { CategoryService } from './category.service';
import { CategoryCreateDto } from './dto/category-create.dto';
import { CategoryUpdateDto } from './dto/category-update.dto';

@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('find-many')
  @SetIgnoreCache()
  findAll() {
    return this.categoryService.findMany();
  }

  @Post('create')
  @ApiBearerAuth()
  @AuthWithRoles([RoleEnum.MANAGER, RoleEnum.ADMIN, RoleEnum.USER])
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files', 10, { limits: { fileSize: 5242880, files: 10 } })) // 5MB
  create(
    @Body() categoryCreateDto: CategoryCreateDto,
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /^(image\/jpeg|image\/png)$/,
        })
        .addMaxSizeValidator({
          maxSize: 5242880, // 5MB
        })
        .build({
          exceptionFactory(error) {
            throw new HttpException(
              'Error: file type should be: jpeg or png, max file size is 5MB!',
              HttpStatus.UNPROCESSABLE_ENTITY
            );
          },
        })
    )
    files: Array<Express.Multer.File>
  ) {
    return this.categoryService.create(categoryCreateDto, files);
  }

  @Patch('update')
  @ApiBearerAuth()
  @AuthWithRoles([RoleEnum.MANAGER, RoleEnum.ADMIN, RoleEnum.USER])
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files', 10, { limits: { fileSize: 5242880, files: 10 } })) // 5MB
  update(
    @Body() categoryUpdateDto: CategoryUpdateDto,
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /^(image\/jpeg|image\/png)$/,
        })
        .addMaxSizeValidator({
          maxSize: 5242880, // 5MB
        })
        .build({
          fileIsRequired: false,
          exceptionFactory(error) {
            throw new HttpException(
              'Error: file type should be: jpeg or png, max file size is 5MB!',
              HttpStatus.UNPROCESSABLE_ENTITY
            );
          },
        })
    )
    files?: Array<Express.Multer.File>
  ) {
    return this.categoryService.update(categoryUpdateDto, files);
  }

  @Delete('delete')
  @ApiBearerAuth()
  @ApiQuery({
    name: 'categoryUuid',
    required: true,
    type: String,
    description: 'The UUID of the category to delete',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @AuthWithRoles([RoleEnum.MANAGER, RoleEnum.ADMIN, RoleEnum.USER])
  delete(@Query('categoryUuid') categoryUuid: string) {
    return this.categoryService.delete(categoryUuid);
  }
}
