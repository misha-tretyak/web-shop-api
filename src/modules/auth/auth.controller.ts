import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SetIgnoreCache } from 'src/decorators/cache.decorator';
import { AuthService } from './auth.service';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { AccessAuthGuard } from './guards/access-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RefreshAuthGuard } from './guards/refresh-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @SetIgnoreCache()
  @UseGuards(LocalAuthGuard)
  localLogin(@Body() body: UserLoginDto, @Req() req) {
    return this.authService.localSignIn(req.user);
  }

  @Post('/register')
  @SetIgnoreCache()
  localRegister(@Body() body: UserRegisterDto) {
    return this.authService.localRegister(body);
  }

  @Get('/refresh')
  @ApiBearerAuth()
  @SetIgnoreCache()
  @UseGuards(RefreshAuthGuard)
  refreshTokens(@Req() req) {
    return this.authService.refreshTokens(req.user);
  }

  @Get('/google')
  @SetIgnoreCache()
  @UseGuards(GoogleAuthGuard)
  async googleLogin() {}

  @Get('/google/callback')
  @SetIgnoreCache()
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@Req() req) {
    return this.authService.googleSignIn(req.user);
  }

  @Get('/logout')
  @ApiBearerAuth()
  @SetIgnoreCache()
  @UseGuards(AccessAuthGuard)
  logout(@Req() req) {
    return this.authService.logout(req.user);
  }
}
