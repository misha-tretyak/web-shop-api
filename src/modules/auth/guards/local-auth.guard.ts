import { ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response } from 'express';
import { LOCAL_AUTH } from '../auth.constants';
import { UserLoginDto } from '../dto/user-login.dto';

@Injectable()
export class LocalAuthGuard extends AuthGuard(LOCAL_AUTH) {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const body = plainToClass(UserLoginDto, request.body);
    const errors = await validate(body);
    const errorMessages = errors.flatMap(({ constraints }) => Object.values(constraints));

    if (errorMessages.length > 0) {
      response.status(HttpStatus.BAD_REQUEST).send({
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'Bad Request',
        message: errorMessages,
      });
    }

    return super.canActivate(context) as boolean | Promise<boolean>;
  }
}
