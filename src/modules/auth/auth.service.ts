import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Prisma, RoleEnum } from '@prisma/client';
import * as argon2 from 'argon2';
import { PinoLogger } from 'nestjs-pino';
import { UtilsService } from 'src/shared/utils/utils.service';
import { generateFromEmail } from 'unique-username-generator';
import { UserWithRelations } from '../user/entities/user.entity';
import { RoleRepository } from '../user/repositories/role.repository';
import { UserRepository } from '../user/repositories/user.repository';
import { UserRegisterDto } from './dto/user-register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly logger: PinoLogger
  ) {
    this.logger.setContext(AuthService.name);
  }

  async findUserByEmail(email: string) {
    const user = await this.userRepository.getUserByAnyCaseEmail(email);

    return this.userRepository.exclude(user, ['passwordHash', 'refreshToken']);
  }

  async registerGoogleUser(googleUser: Prisma.UserCreateInput) {
    const role = await this.roleRepository.getRoleByName(RoleEnum.USER);
    const user = await this.userRepository.create({
      data: {
        ...googleUser,
        roles: {
          connect: { roleUuid: role.roleUuid },
        },
      },
    });

    if (!user) throw new UnauthorizedException();

    await this.userRepository.update({
      where: { email: googleUser.email },
      data: { provider: googleUser.provider, providerId: googleUser.providerId },
    });
    const tokens = await this.getTokens(user.userUuid, user.email);
    await this.updateRefreshToken(user.userUuid, tokens.refreshToken);

    return tokens;
  }

  async googleSignIn(googleUser: Prisma.UserCreateInput) {
    if (!googleUser) throw new UnauthorizedException();

    const userInDb = await this.userRepository.getUserByAnyCaseEmail(googleUser.email);
    if (!userInDb) {
      return this.registerGoogleUser(googleUser);
    }

    await this.userRepository.update({
      where: { email: googleUser.email },
      data: { provider: googleUser.provider, providerId: googleUser.providerId },
    });
    const tokens = await this.getTokens(userInDb.userUuid, userInDb.email);
    await this.updateRefreshToken(userInDb.userUuid, tokens.refreshToken);

    return tokens;
  }

  async validateUserWithPassword(email: string, password: string) {
    const user = await this.userRepository.findOneAndThrowIfNotExist({ where: { email } });
    const isPasswordMatching = await argon2.verify(user.passwordHash, password);
    if (!isPasswordMatching) throw new BadRequestException('Wrong credentials provided');

    return this.userRepository.exclude(user, ['passwordHash']);
  }

  async localSignIn(user: UserWithRelations) {
    const tokens = await this.getTokens(user.userUuid, user.email);
    await this.updateRefreshToken(user.userUuid, tokens.refreshToken);

    return tokens;
  }

  async localRegister(registerData: UserRegisterDto) {
    const userInDb = await this.userRepository.getUserByAnyCaseEmail(registerData.email);

    if (userInDb) throw new BadRequestException('User already exist!');

    const role = await this.roleRepository.getRoleByName(RoleEnum.USER);
    const hashedPassword = await UtilsService.hashData(registerData.password);
    const userCreateData: Prisma.UserCreateInput = {
      firstName: registerData.firstName,
      lastName: registerData.lastName,
      email: registerData.email,
      passwordHash: hashedPassword,
      language: registerData?.language,
      username: generateFromEmail(registerData.email, 5),
      dateOfBirth: registerData?.dateOfBirth,
      userInitial: `${registerData.firstName?.charAt(0) || ''}${registerData.lastName?.charAt(0) || ''}`,
      displayName: `${registerData.firstName || ''}${registerData.lastName || ''}`,
      roles: {
        connect: { roleUuid: role.roleUuid },
      },
    };

    const user = await this.userRepository.create({ data: userCreateData });

    if (!user) throw new UnauthorizedException();

    const tokens = await this.getTokens(user.userUuid, user.email);
    await this.updateRefreshToken(user.userUuid, tokens.refreshToken);

    return tokens;
  }

  async logout(user: UserWithRelations) {
    await this.userRepository.update({
      where: { userUuid: user.userUuid },
      data: { refreshToken: null },
    });

    return this.userRepository.exclude(user, ['passwordHash', 'refreshToken', 'roles']);
  }

  async updateRefreshToken(userUuid: string, refreshToken: string) {
    const hashedRefreshToken = await UtilsService.hashData(refreshToken);
    await this.userRepository.update({
      where: { userUuid },
      data: { refreshToken: hashedRefreshToken },
    });
  }

  async getTokens(userId: string, email: string): Promise<{ accessToken: string; refreshToken: string }> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '15m',
        }
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        }
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(userFromRequest: UserWithRelations) {
    const userInDb = await this.userRepository.getUserByAnyCaseEmail(userFromRequest.email);
    if (!userInDb?.refreshToken) throw new ForbiddenException('Access Denied');

    const refreshTokenMatches = await argon2.verify(userInDb.refreshToken, userFromRequest.refreshToken);
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(userInDb.userUuid, userInDb.email);
    await this.updateRefreshToken(userInDb.userUuid, tokens.refreshToken);

    return tokens;
  }
}
