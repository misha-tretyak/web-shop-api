import { Body, Controller, Delete, Get, Patch, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RoleEnum } from '@prisma/client';
import { AuthWithRoles } from 'src/decorators/auth.decorator';
import { UserAddAddressDto } from './dto/user-add-address.dto';
import { UserAddRolesDto } from './dto/user-add-roles.dto';
import { UserRemoveRolesDto } from './dto/user-remove-roles.dto';
import { UserUpdateAddressDto } from './dto/user-update-address.dto';
import { UserUpdateDto } from './dto/user-update.dto';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('info')
  @ApiBearerAuth()
  @AuthWithRoles()
  info(@Req() req) {
    return req.user;
  }

  @Patch('update')
  @ApiBearerAuth()
  @AuthWithRoles()
  update(@Body() body: UserUpdateDto, @Req() req) {
    return this.userService.update(body, req.user.userUuid);
  }

  @Patch('add-roles')
  @ApiBearerAuth()
  @AuthWithRoles([RoleEnum.ADMIN])
  addRoles(@Body() body: UserAddRolesDto) {
    return this.userService.addRoles(body);
  }

  @Patch('add-address')
  @ApiBearerAuth()
  @AuthWithRoles()
  addAddress(@Body() body: UserAddAddressDto, @Req() req) {
    return this.userService.addAddress(body, req.user.userUuid);
  }

  @Patch('update-address')
  @ApiBearerAuth()
  @AuthWithRoles()
  updateAddress(@Body() body: UserUpdateAddressDto, @Req() req) {
    return this.userService.updateAddress(body, req.user.userUuid);
  }

  @Patch('remove-roles')
  @ApiBearerAuth()
  @AuthWithRoles([RoleEnum.ADMIN])
  removeRoles(@Body() body: UserRemoveRolesDto) {
    return this.userService.removeRoles(body);
  }

  @Delete('delete')
  @ApiBearerAuth()
  @AuthWithRoles()
  delete(@Req() req) {
    return this.userService.delete(req.user.userUuid);
  }
}
