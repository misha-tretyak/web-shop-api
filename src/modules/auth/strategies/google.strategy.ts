import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Prisma } from '@prisma/client';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { generateFromEmail } from 'unique-username-generator';
import { GOOGLE_AUTH } from '../auth.constants';
import { GoogleProfile } from '../auth.interface';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, GOOGLE_AUTH) {
  constructor(@Inject(ConfigService) readonly configService: ConfigService) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  async validate(_accessToken: string, _refreshToken: string, profile: GoogleProfile, done: VerifyCallback) {
    const user: Prisma.UserCreateInput = {
      provider: profile?.provider,
      providerId: profile?.id,
      email: profile.emails?.[0]?.value,
      username: generateFromEmail(profile.emails?.[0]?.value, 5),
      userInitial: `${profile?.name?.givenName?.charAt(0) || ''}${profile?.name?.familyName?.charAt(0) || ''}`,
      firstName: profile?.name?.givenName,
      lastName: profile?.name?.familyName,
      displayName: profile?.displayName,
    };

    done(null, user);
  }
}
