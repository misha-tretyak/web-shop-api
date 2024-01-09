import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ErrorsHandleService } from '../../shared/services/error.service';
import { PrismaService } from '../../shared/services/prisma.service';
import { RoleRepository } from '../user/repositories/role.repository';
import { UserRepository } from '../user/repositories/user.repository';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    PrismaService,
    UserRepository,
    RoleRepository,
    GoogleStrategy,
    LocalStrategy,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    AuthService,
    ErrorsHandleService,
  ],
})
export class AuthModule {}
