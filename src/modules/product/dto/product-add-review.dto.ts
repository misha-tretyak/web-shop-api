import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class ProductAddReviewDto {
  @ApiProperty({ required: true, type: 'number', default: 5 })
  @IsNumber()
  rating: number;

  @ApiProperty({ required: false, type: 'string', default: 'My review' })
  @IsString()
  @IsOptional()
  comment?: string;

  @ApiProperty({ required: false, type: 'string', default: 'My review' })
  @IsUUID(4)
  productUuid: string;
}
