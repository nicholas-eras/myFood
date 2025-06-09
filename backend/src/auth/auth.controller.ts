import {
  Body, Controller, Post, Req, Res, UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Response, Request } from 'express';
import { CsrfGuard } from './csrf.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken, csrfToken } = await this.authService.login(dto);

    return { accessToken };
  }

  @Post('refresh')
  @UseGuards(CsrfGuard)
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies['refresh_token'];
    const csrfToken = req.cookies['csrf_token'];

    const { accessToken, newRefreshToken, newCsrfToken } = await this.authService.refresh(refreshToken, csrfToken);

    return { accessToken };
  }
}
