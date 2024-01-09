import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CategoryCreateDto {
  @ApiProperty({ type: 'string', format: 'binary', isArray: true, required: true })
  files: string[];

  @ApiProperty({ required: true, type: 'string', default: 'Test Category' })
  @IsString()
  name: string;
}
