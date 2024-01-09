import { ApiProperty } from '@nestjs/swagger';
import { ThemeEnum } from '@prisma/client';
import { IsDate, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

export class UserUpdateDto {
  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiProperty({
    required: false,
    type: Date,
  })
  @IsOptional()
  @IsDate()
  dateOfBirth?: Date;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  @IsEnum(ThemeEnum)
  theme?: ThemeEnum;
}
