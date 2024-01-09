import { BadRequestException, Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { isUUID } from 'class-validator';

@Injectable()
export class UtilsService {
  static validateArrayOfUuids(value: string | string[], required: boolean = false) {
    if (!value && !required) return [];

    if (typeof value === 'string') {
      const uuids = value.split(',');
      console.log(uuids);

      const allUuidsValid = uuids.every((uuid) => isUUID(uuid));

      if (allUuidsValid) {
        return uuids;
      } else {
        throw new BadRequestException('Invalid UUID format in array.');
      }
    } else if (Array.isArray(value)) {
      const allUuidsValid = value.every((uuid) => isUUID(uuid));

      if (allUuidsValid) {
        return value;
      } else {
        throw new BadRequestException('Invalid UUID format in array.');
      }
    } else {
      throw new BadRequestException('Invalid input format for UUID array.');
    }
  }

  static hashData(data: string) {
    return argon2.hash(data);
  }
}
