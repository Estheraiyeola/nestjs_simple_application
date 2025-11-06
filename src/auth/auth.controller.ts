
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  Res,
  UseGuards
} from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from './auth.guard';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/dto.login';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  private readonly jwtCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    path: '/',
  };


  // login
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async logIn(@Body() signInDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const { access_token } = await this.authService.logIn(signInDto.email, signInDto.password);
    res.cookie('jwt', access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 1000 * 24, 
  });
  return { ok: true, message: 'Login successful' };
  }


  // logout
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logOut(@Request() req: any, @Res({ passthrough: true }) res: Response) {
    if (req.session && typeof req.session.destroy === 'function') {
      try {
        await new Promise<void>((resolve) => req.session.destroy(() => resolve()));
      } catch (e) {
         console.log("Error",e);
      }
    }

    try {
      res.clearCookie('jwt', this.jwtCookieOptions);
      res.cookie('jwt', '', { ...this.jwtCookieOptions, maxAge: 0 });
    } catch (e) {
      console.log("Error", e);
    }

    return { ok: true, message: 'Logout successful' };
  }

}
