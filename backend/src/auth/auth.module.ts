import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { JwtRefreshStrategy } from './jwt-refresh.strategy';
import { CsrfGuard } from './csrf.guard';
import { UsersModule } from '../users/users.module'; 

@Module({
  imports: [
    PassportModule,
    JwtModule.register({}),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtRefreshStrategy, CsrfGuard],
})
export class AuthModule {}
