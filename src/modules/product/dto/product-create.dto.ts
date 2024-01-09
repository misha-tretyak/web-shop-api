import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsNumber, IsOptional, IsString } from 'class-validator';

export class ProductCreateDto {
  @ApiProperty({ type: 'string', format: 'binary', isArray: true, required: true })
  files: string[];

  @ApiProperty({ required: true, type: 'string', default: 'Test Product' })
  @IsString()
  name: string;

  @ApiProperty({ required: true, type: 'string', default: 'My super description' })
  @IsString()
  description: string;

  @ApiProperty({ required: true, type: 'number', default: 128.5 })
  @IsNumber()
  price: number;

  @ApiProperty({ required: true, type: 'number', default: 35 })
  @IsNumber()
  stock: number;

  @ApiProperty({ required: false, type: 'string', default: 'green' })
  @IsString()
  @IsOptional()
  color?: string;

  @ApiProperty({ required: true, isArray: true, type: 'string', default: ['46c49957-8937-4ca0-9bdd-7dffd4330053'] })
  @Allow()
  categoryUuids: string[];
}
