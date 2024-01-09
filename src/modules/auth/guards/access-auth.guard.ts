import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ACCESS_AUTH } from '../auth.constants';

@Injectable()
export class AccessAuthGuard extends AuthGuard(ACCESS_AUTH) {}
