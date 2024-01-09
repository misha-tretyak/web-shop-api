import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PinoLogger } from 'nestjs-pino';
import { UtilsService } from 'src/shared/utils/utils.service';
import { UserAddAddressDto } from './dto/user-add-address.dto';
import { UserAddRolesDto } from './dto/user-add-roles.dto';
import { UserRemoveRolesDto } from './dto/user-remove-roles.dto';
import { UserUpdateAddressDto } from './dto/user-update-address.dto';
import { UserUpdateDto } from './dto/user-update.dto';
import { AddressRepository } from './repositories/address.repository';
import { RoleRepository } from './repositories/role.repository';
import { UserRepository } from './repositories/user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
    private readonly addressRepository: AddressRepository,
    private readonly logger: PinoLogger
  ) {
    this.logger.setContext(UserService.name);
  }

  async update(userUpdateDto: UserUpdateDto, userUuid: string) {
    const user = await this.userRepository.findOneAndThrowIfNotExist({
      where: { userUuid },
    });

    const userUpdateData: Prisma.UserUpdateInput = {
      firstName: userUpdateDto?.firstName || user.firstName,
      lastName: userUpdateDto?.lastName || user.lastName,
      dateOfBirth: userUpdateDto?.dateOfBirth || user.dateOfBirth,
      language: userUpdateDto?.language || user.language,
      theme: userUpdateDto?.theme || user.theme,
    };

    if (userUpdateDto?.username) {
      const isUsernameExists = await this.userRepository.findOneWithoutChecking({
        where: { username: userUpdateDto.username },
      });

      if (isUsernameExists) throw new BadRequestException('User with this username already exists!');

      userUpdateData.username = userUpdateDto?.username;
    }

    if (userUpdateDto?.password) {
      userUpdateData.passwordHash = await UtilsService.hashData(userUpdateDto?.password);
    }

    if (userUpdateDto.firstName || userUpdateDto.lastName) {
      userUpdateData.userInitial = `${userUpdateDto?.firstName?.charAt(0) || user.firstName?.charAt(0)}${
        userUpdateDto.lastName?.charAt(0) || user.lastName?.charAt(0)
      }`;
      userUpdateData.displayName = `${userUpdateDto?.firstName || user.firstName} ${
        userUpdateDto.lastName || user.lastName
      }`;
    }

    const updatedUser = await this.userRepository.update({
      where: { userUuid },
      data: userUpdateData,
      include: { roles: true, address: true },
    });

    return this.userRepository.exclude(updatedUser, ['passwordHash', 'refreshToken']);
  }

  async addRoles(userAddRolesDto: UserAddRolesDto) {
    await this.userRepository.findOneAndThrowIfNotExist({ where: { userUuid: userAddRolesDto.userUuid } });
    await Promise.all(
      userAddRolesDto.roleUuids.map((roleUuid) =>
        this.roleRepository.findOneAndThrowIfNotExist({ where: { roleUuid } })
      )
    );

    const updatedUser = await this.userRepository.update({
      where: { userUuid: userAddRolesDto.userUuid },
      data: {
        roles: {
          connect: userAddRolesDto.roleUuids.map((roleUuid) => {
            return { roleUuid };
          }),
        },
      },
      include: { roles: true, address: true },
    });

    return this.userRepository.exclude(updatedUser, ['passwordHash', 'refreshToken']);
  }

  async addAddress(userAddAddressDto: UserAddAddressDto, userUuid: string) {
    await this.userRepository.findOneAndThrowIfNotExist({ where: { userUuid } });
    await this.addressRepository.create({
      data: {
        ...userAddAddressDto,
        user: {
          connect: { userUuid },
        },
      },
    });

    const userWithAddress = await this.userRepository.findOneByUniqueField({
      where: { userUuid },
      include: { address: true, roles: true },
    });

    return userWithAddress;
  }

  async updateAddress(userUpdateAddressDto: UserUpdateAddressDto, userUuid: string) {
    await this.userRepository.findOneAndThrowIfNotExist({ where: { userUuid } });
    await this.addressRepository.update({
      where: { userUuid },
      data: userUpdateAddressDto,
    });

    const userWithAddress = await this.userRepository.findOneByUniqueField({
      where: { userUuid },
      include: { address: true, roles: true },
    });

    return userWithAddress;
  }

  async removeRoles(userRemoveRolesDto: UserRemoveRolesDto) {
    await this.userRepository.findOneAndThrowIfNotExist({ where: { userUuid: userRemoveRolesDto.userUuid } });
    await Promise.all(
      userRemoveRolesDto.roleUuids.map((roleUuid) =>
        this.roleRepository.findOneAndThrowIfNotExist({ where: { roleUuid } })
      )
    );

    const updatedUser = await this.userRepository.update({
      where: { userUuid: userRemoveRolesDto.userUuid },
      data: {
        roles: {
          disconnect: userRemoveRolesDto.roleUuids.map((roleUuid) => {
            return { roleUuid };
          }),
        },
      },
      include: { roles: true, address: true },
    });

    return this.userRepository.exclude(updatedUser, ['passwordHash', 'refreshToken']);
  }

  async delete(userUuid: string) {
    await this.userRepository.findOneAndThrowIfNotExist({
      where: { userUuid },
      include: {
        roles: true,
        address: true,
      },
    });

    const result = await this.userRepository.delete({ where: { userUuid } });

    return result;
  }
}
