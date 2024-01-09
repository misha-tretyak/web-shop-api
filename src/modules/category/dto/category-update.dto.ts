import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CategoryUpdateDto {
  @ApiProperty({ type: 'string', format: 'binary', isArray: true, required: false })
  @IsOptional()
  files?: string[];

  @ApiProperty({ required: false, type: 'string' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    type: 'array',
    items: { type: 'string', format: 'uuid' },
    required: false,
  })
  @IsOptional()
  imagesUuidsToRemove?: string[];

  @ApiProperty({ required: true, type: 'string', format: 'uuid', default: '7b03d4d6-d404-4597-a0f7-6128e84c244e' })
  @IsUUID(4)
  categoryUuid: string;
}
