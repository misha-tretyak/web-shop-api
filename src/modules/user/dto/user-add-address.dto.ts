import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UserAddAddressDto {
  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  streetAddress: string;

  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  city: string;

  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  postalCode: string;

  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  country: string;
}
