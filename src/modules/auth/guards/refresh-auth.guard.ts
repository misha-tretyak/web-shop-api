import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { REFRESH_AUTH } from '../auth.constants';

@Injectable()
export class RefreshAuthGuard extends AuthGuard(REFRESH_AUTH) {}
