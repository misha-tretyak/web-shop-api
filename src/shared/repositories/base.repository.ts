/*
https://www.prisma.io/docs/concepts/components/prisma-client/crud
https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries
*/

import { NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { NOT_EXIST_MSG, NOT_EXIST_TYPE } from '../constants/server.constants';
import { ErrorsHandleService } from '../services/error.service';
import { PrismaService } from '../services/prisma.service';
import { ErrorType } from '../types';

export abstract class BaseRepository<MODEL, FU, FF, FM, C, CM, U, UM, UPS, D, DM, CC> {
  private readonly model: string;
  private readonly ORM: PrismaService;
  private readonly errorsHandleService: ErrorsHandleService;

  protected constructor(model: string, database: PrismaService, errorsHandleService: ErrorsHandleService) {
    this.model = model;
    this.ORM = database;
    this.errorsHandleService = errorsHandleService;
  }

  async queryRaw(data: string, optionalErrorMessage?: string): Promise<MODEL[]> {
    try {
      // @ts-ignore
      return await this.ORM.$queryRawUnsafe(data);
    } catch (e) {
      const err: ErrorType = e as ErrorType;
      throw this.errorsHandleService.handleAllErrors(err, 'queryRaw', this.model, optionalErrorMessage);
    }
  }

  async findOneAndThrowIfNotExist(data: FF, optionalErrorMessage?: string): Promise<NonNullable<MODEL>> {
    try {
      // @ts-ignore
      const res = await this.ORM[this.model].findFirst(data);
      if (!res) {
        throw new NotFoundException(NOT_EXIST_MSG(this.model), NOT_EXIST_TYPE(this.model));
      } else {
        return res;
      }
    } catch (e) {
      const err = e as ErrorType;
      if (e instanceof NotFoundException) {
        throw e;
      } else {
        throw this.errorsHandleService.throwErrorIfServerError(
          err,
          'findOneAndThrowIfNotExist',
          this.model,
          optionalErrorMessage
        );
      }
    }
  }

  async findOneWithoutChecking(data: FF, optionalErrorMessage?: string): Promise<MODEL> {
    try {
      // @ts-ignore
      return await this.ORM[this.model].findFirst(data);
    } catch (e) {
      const err = e as ErrorType;
      throw this.errorsHandleService.throwErrorIfServerError(
        err,
        'findOneWithoutChecking',
        this.model,
        optionalErrorMessage
      );
    }
  }

  async findOneByUniqueField(data: FU, optionalErrorMessage?: string): Promise<MODEL> {
    try {
      // @ts-ignore
      const res = await this.ORM[this.model].findUnique(data);
      if (!res) {
        throw new NotFoundException(NOT_EXIST_MSG(this.model), NOT_EXIST_TYPE(this.model));
      } else {
        return res;
      }
    } catch (e) {
      const err = e as ErrorType;
      if (e instanceof NotFoundException) {
        throw e;
      } else {
        throw this.errorsHandleService.throwErrorIfServerError(
          err,
          'findOneByUniqueField',
          this.model,
          optionalErrorMessage
        );
      }
    }
  }

  async findMany(data: FM, optionalErrorMessage?: string): Promise<MODEL[]> {
    try {
      // @ts-ignore
      return await this.ORM[this.model].findMany(data);
    } catch (e) {
      const err = e as ErrorType;
      throw this.errorsHandleService.handleAllErrors(err, 'findMany', this.model, optionalErrorMessage);
    }
  }

  async findManyAndPaginate(
    paginateOptions: PaginateOptions,
    args?: FM,
    optionalErrorMessage?: string
  ): Promise<PaginatedResult<MODEL>> {
    try {
      const page = Number(paginateOptions?.page) || 1;
      const perPage = Number(paginateOptions?.perPage) || 10;

      const skip = page > 0 ? perPage * (page - 1) : 0;
      const [total, data] = await Promise.all([
        // @ts-ignore
        this.ORM[this.model].count({ where: args.where }),
        this.ORM[this.model].findMany({
          ...args,
          take: perPage,
          skip,
        }),
      ]);
      const lastPage = Math.ceil(total / perPage);

      return {
        data,
        meta: {
          total,
          lastPage,
          currentPage: page,
          perPage,
          prev: page > 1 ? page - 1 : null,
          next: page < lastPage ? page + 1 : null,
        },
      };
    } catch (e) {
      const err = e as ErrorType;
      throw this.errorsHandleService.handleAllErrors(err, 'paginate', this.model, optionalErrorMessage);
    }
  }

  async create(data: C, optionalErrorMessage?: string): Promise<MODEL> {
    try {
      // @ts-ignore
      return await this.ORM[this.model].create(data);
    } catch (e) {
      const err = e as ErrorType;
      throw this.errorsHandleService.handleAllErrors(err, 'create', this.model, optionalErrorMessage);
    }
  }

  async createMany(data: CM, optionalErrorMessage?: string): Promise<ICountResponse> {
    try {
      // @ts-ignore
      return await this.ORM[this.model].createMany(data);
    } catch (e) {
      const err = e as ErrorType;
      throw this.errorsHandleService.handleAllErrors(err, 'createMany', this.model, optionalErrorMessage);
    }
  }

  async update(data: U, optionalErrorMessage?: string): Promise<MODEL> {
    try {
      // @ts-ignore
      return await this.ORM[this.model].update(data);
    } catch (e) {
      const err = e as ErrorType;
      throw this.errorsHandleService.handleAllErrors(err, 'update', this.model, optionalErrorMessage);
    }
  }

  async updateMany(data: UM, optionalErrorMessage?: string): Promise<ICountResponse> {
    try {
      // @ts-ignore
      return await this.ORM[this.model].updateMany(data);
    } catch (e) {
      const err = e as ErrorType;
      throw this.errorsHandleService.handleAllErrors(err, 'updateMany', this.model, optionalErrorMessage);
    }
  }

  async delete(data: D, optionalErrorMessage?: string): Promise<BaseEntityDeleteResult<MODEL>> {
    try {
      // @ts-ignore
      const deleteEntity = this.ORM[this.model].delete(data);
      const transactionRes = await this.ORM.$transaction([deleteEntity]);

      return {
        msg: MODEL_DELETE_SUCCESS_MSG(this.model),
        deletedEntity: transactionRes[0],
      };
    } catch (e) {
      const err = e as ErrorType;
      throw this.errorsHandleService.handleAllErrors(err, 'delete', this.model, optionalErrorMessage);
    }
  }

  async deleteMany(data: DM, optionalErrorMessage?: string): Promise<Prisma.BatchPayload> {
    try {
      // @ts-ignore
      return await this.ORM[this.model].deleteMany(data);
    } catch (e) {
      const err = e as ErrorType;
      throw this.errorsHandleService.handleAllErrors(err, 'deleteMany', this.model, optionalErrorMessage);
    }
  }

  async checkIfExist(data: FF, optionalErrorMessage?: string): Promise<boolean | MODEL> {
    try {
      // @ts-ignore
      const res = await this.ORM[this.model].findFirst(data);
      if (!res) {
        return false;
      }
      return res;
    } catch (e) {
      const err = e as ErrorType;
      throw this.errorsHandleService.handleAllErrors(err, 'checkIfExist', this.model, optionalErrorMessage);
    }
  }

  async count(data: CC, optionalErrorMessage?: string): Promise<number> {
    try {
      // @ts-ignore
      return await this.ORM[this.model].count(data);
    } catch (e) {
      const err = e as ErrorType;
      throw this.errorsHandleService.handleAllErrors(err, 'count', this.model, optionalErrorMessage);
    }
  }

  async upsert(data: UPS, optionalErrorMessage?: string): Promise<MODEL> {
    try {
      // @ts-ignore
      return await this.ORM[this.model].upsert(data);
    } catch (e) {
      const err = e as ErrorType;
      throw this.errorsHandleService.handleAllErrors(err, 'upsert', this.model, optionalErrorMessage);
    }
  }

  exclude<MODEL, Key extends keyof MODEL>(model: MODEL, keys: Key[]): Omit<MODEL, Key> {
    return Object.fromEntries(Object.entries(model).filter(([key]) => !keys.includes(key as Key))) as Omit<MODEL, Key>;
  }
}

export const MODEL_DELETE_SUCCESS_MSG = (model: string) => `${model} was deleted successfully`;

export interface BaseEntityDeleteResult<MODEL> {
  msg: string;
  deletedEntity: MODEL;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    lastPage: number;
    currentPage: number;
    perPage: number;
    prev: number | null;
    next: number | null;
  };
}

type PaginateOptions = { page?: number | string; perPage?: number | string };

interface ICountResponse {
  count: number;
}
