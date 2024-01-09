import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { PinoLogger } from 'nestjs-pino';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ACCESS_AUTH } from '../auth.constants';
import { JwtPayload } from '../auth.interface';
import { AuthService } from '../auth.service';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, ACCESS_AUTH) {
  constructor(
    @Inject(ConfigService) readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly logger: PinoLogger
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_ACCESS_SECRET'),
    });

    this.logger.setContext(AccessTokenStrategy.name);
  }

  async validate(payload: JwtPayload) {
    const user = await this.authService.findUserByEmail(payload.email);
    if (!user) throw new UnauthorizedException('Please log in to continue');

    return user;
  }
}
