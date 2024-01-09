import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class ProductUpdateDto {
  @ApiProperty({ type: 'string', format: 'binary', isArray: true, required: false })
  @IsOptional()
  files?: string[];

  @ApiProperty({ required: false, type: 'string' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false, type: 'string' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false, type: 'number' })
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiProperty({ required: false, type: 'number' })
  @IsNumber()
  @IsOptional()
  stock?: number;

  @ApiProperty({ required: false, type: 'string' })
  @IsString()
  @IsOptional()
  color?: string;

  @ApiProperty({ type: 'array', items: { type: 'string', format: 'uuid' }, required: false })
  @IsOptional()
  categoryUuids?: string[];

  @ApiProperty({
    type: 'array',
    items: { type: 'string', format: 'uuid' },
    default: ['2af0ea47-3f61-4e13-86a7-2bbcc531d6f6', 'a0d7024d-10b1-4ba0-a8b2-5059d6da28'],
    required: false,
  })
  @IsOptional()
  imagesUuidsToRemove?: string[];

  @ApiProperty({ required: true, type: 'string', format: 'uuid', default: '7b03d4d6-d404-4597-a0f7-6128e84c244e' })
  @IsUUID(4)
  productUuid: string;
}
