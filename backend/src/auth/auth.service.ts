import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service'; 
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const csrfToken = randomUUID();
    const accessToken = this.jwt.sign({ sub: user.id }, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '15m',
    });

    const refreshToken = this.jwt.sign({ sub: user.id }, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    // Aqui você pode salvar refresh + csrf no banco (opcional)

    return { accessToken, refreshToken, csrfToken };
  }

  async refresh(refreshToken: string, csrfToken: string) {
    try {
      const payload = this.jwt.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      // Validação extra: bater csrfToken com o salvo (se aplicável)

      const newCsrfToken = randomUUID();
      const accessToken = this.jwt.sign({ sub: payload.sub }, {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: '15m',
      });

      const newRefreshToken = this.jwt.sign({ sub: payload.sub }, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
      });

      return { accessToken, newRefreshToken, newCsrfToken };
    } catch {
      throw new UnauthorizedException();
    }
  }
}
