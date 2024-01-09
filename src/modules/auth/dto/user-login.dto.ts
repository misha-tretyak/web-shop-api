import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class UserLoginDto {
  @ApiProperty({
    required: true,
    default: 'misha.tret.ua@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    required: true,
    default: 'super_password',
  })
  @IsString()
  @MinLength(8)
  password: string;
}
