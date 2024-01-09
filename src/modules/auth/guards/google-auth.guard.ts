import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GOOGLE_AUTH } from '../auth.constants';

@Injectable()
export class GoogleAuthGuard extends AuthGuard(GOOGLE_AUTH) {}
