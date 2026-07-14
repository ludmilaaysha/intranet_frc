import {
  Controller,
  Get,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomBytes, timingSafeEqual } from 'crypto';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import type { AuthenticatedRequest } from './auth.types';
import { JwtAuthGuard } from './jwt-auth.guard';

const STATE_COOKIE = 'oauth_state';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  @Get('login')
  login(@Res() response: Response) {
    const state = randomBytes(32).toString('hex');
    response.cookie(STATE_COOKIE, state, {
      httpOnly: true,
      sameSite: 'lax',
      secure: this.config.get<string>('NODE_ENV') === 'production',
      maxAge: 10 * 60 * 1000,
      path: '/auth/callback',
    });
    return response.redirect(this.authService.getAuthorizationUrl(state));
  }

  @Get('callback')
  async callback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    if (
      !code ||
      !this.validState(state, this.readCookie(request, STATE_COOKIE))
    ) {
      throw new UnauthorizedException('Retorno OAuth2 invalido');
    }
    response.clearCookie(STATE_COOKIE, { path: '/auth/callback' });
    const accessToken = await this.authService.authenticate(code);
    const frontendUrl = this.config.get<string>(
      'FRONTEND_URL',
      'http://localhost:5173',
    );
    return response.redirect(
      `${frontendUrl}/auth/callback#access_token=${encodeURIComponent(accessToken)}`,
    );
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Req() request: AuthenticatedRequest) {
    return request.user;
  }

  private validState(received?: string, expected?: string): boolean {
    if (!received || !expected) return false;
    const left = Buffer.from(received);
    const right = Buffer.from(expected);
    return left.length === right.length && timingSafeEqual(left, right);
  }

  private readCookie(request: Request, name: string): string | undefined {
    const prefix = `${name}=`;
    return request.headers.cookie
      ?.split(';')
      .map((value) => value.trim())
      .find((value) => value.startsWith(prefix))
      ?.slice(prefix.length);
  }
}
