import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class UserRegisterDto {
  @ApiProperty({
    required: true,
    default: 'Misha',
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    required: true,
    default: 'Tretyak',
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    required: true,
    default: 'uk',
  })
  @IsString()
  @IsOptional()
  language?: string;

  @ApiProperty({
    required: false,
    default: '2000-11-19',
  })
  @IsDate()
  @IsOptional()
  dateOfBirth?: Date;

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
