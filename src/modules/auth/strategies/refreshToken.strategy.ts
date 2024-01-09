import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { PinoLogger } from 'nestjs-pino';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { REFRESH_AUTH } from '../auth.constants';
import { JwtPayload } from '../auth.interface';
import { AuthService } from '../auth.service';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, REFRESH_AUTH) {
  constructor(
    @Inject(ConfigService) readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly logger: PinoLogger
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });

    this.logger.setContext(RefreshTokenStrategy.name);
  }

  async validate(req: Request, payload: JwtPayload) {
    const user = await this.authService.findUserByEmail(payload.email);
    if (!user) throw new UnauthorizedException('Please log in to continue');
    const refreshToken = req.get('Authorization').replace('Bearer', '').trim();

    return { ...user, refreshToken };
  }
}
