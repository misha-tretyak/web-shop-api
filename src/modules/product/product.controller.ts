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
  Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';
import { RoleEnum } from '@prisma/client';
import { AuthWithRoles } from 'src/decorators/auth.decorator';
import { ProductAddReviewDto } from './dto/product-add-review.dto';
import { ProductCreateDto } from './dto/product-create.dto';
import { FindManyProductsDto } from './dto/product-find-many.dto';
import { ProductUpdateDto } from './dto/product-update.dto';
import { ProductService } from './product.service';

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('find-many')
  findMany(
    @Body()
    body: FindManyProductsDto
  ) {
    return this.productService.findMany(body);
  }

  @Post('create')
  @ApiBearerAuth()
  @AuthWithRoles([RoleEnum.MANAGER, RoleEnum.ADMIN, RoleEnum.USER])
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files', 10, { limits: { fileSize: 5242880, files: 10 } })) // 5MB
  create(
    @Body() productCreateDto: ProductCreateDto,
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
    return this.productService.create(productCreateDto, files);
  }

  @Patch('update')
  @ApiBearerAuth()
  @AuthWithRoles([RoleEnum.MANAGER, RoleEnum.ADMIN, RoleEnum.USER])
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files', 10, { limits: { fileSize: 5242880, files: 10 } })) // 5MB
  update(
    @Body() productUpdateDto: ProductUpdateDto,
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
    return this.productService.update(productUpdateDto, files);
  }

  @Patch('add-review')
  @ApiBearerAuth()
  @AuthWithRoles()
  addReview(@Body() body: ProductAddReviewDto, @Req() req) {
    return this.productService.addReview(body, req.user.userUuid);
  }

  @Delete('delete')
  @ApiBearerAuth()
  @ApiQuery({
    name: 'productUuid',
    required: true,
    type: String,
    description: 'The UUID of the product to delete',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @AuthWithRoles([RoleEnum.MANAGER, RoleEnum.ADMIN, RoleEnum.USER])
  delete(@Query('productUuid') productUuid: string) {
    return this.productService.delete(productUuid);
  }
}
