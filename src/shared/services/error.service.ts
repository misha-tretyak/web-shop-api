import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PinoLogger } from 'nestjs-pino';
import {
  PRISMA_NOT_EXIST_ERROR_CODE,
  PRISMA_RAW_QUERY_ERROR_CODE,
  PRISMA_UNIQUE_ERROR,
  PRISMA_UNIQUE_ERROR_CODE,
} from '../constants/prisma.constants';
import { NOT_EXIST_MSG, NOT_EXIST_TYPE, RAW_QUERY_ERROR_MSG, RAW_QUERY_ERROR_TYPE } from '../constants/server.constants';
import { ErrorType } from '../types';

@Injectable()
export class ErrorsHandleService {
  constructor(private readonly logger: PinoLogger) {}

  handleAllErrors(e: ErrorType, methodName: string, entityName: string, optionalErrorMessage?: string) {
    this.throwErrorIfUnique(e, entityName, optionalErrorMessage);
    this.throwErrorIfExist(e, entityName, optionalErrorMessage);
    this.throwErrorIfRawQueryError(e, entityName, optionalErrorMessage);
    this.throwErrorIfServerError(e, methodName, entityName, optionalErrorMessage);
  }

  throwErrorIfUnique(e: ErrorType, entityName: string, optionalErrorMessage?: string) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === PRISMA_UNIQUE_ERROR_CODE) {
        const meta = e?.meta as { target: string[] };
        throw new ConflictException(PRISMA_UNIQUE_ERROR(entityName, meta.target[0]), optionalErrorMessage);
      }
    }
  }

  throwErrorIfExist(e: ErrorType, entityName: string, optionalErrorMessage?: string) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === PRISMA_NOT_EXIST_ERROR_CODE) {
        throw new NotFoundException(optionalErrorMessage ?? NOT_EXIST_MSG(entityName), NOT_EXIST_TYPE(entityName));
      }
    }
  }

  throwErrorIfRawQueryError(e: ErrorType, entityName: string, optionalErrorMessage?: string) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === PRISMA_RAW_QUERY_ERROR_CODE) {
        this.logger.error(e?.message, `Base entity ${entityName} rawQuery`);
        throw new InternalServerErrorException(optionalErrorMessage ?? RAW_QUERY_ERROR_MSG(entityName), RAW_QUERY_ERROR_TYPE(entityName));
      }
    }
  }

  throwErrorIfServerError(e: ErrorType, methodName: string, entityName: string, optionalErrorMessage?: string) {
    this.logger.error(e?.message, `Base entity method name [${methodName}] [${entityName}]`);
    throw new InternalServerErrorException(e?.message, optionalErrorMessage);
  }
}
