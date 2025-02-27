import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService)=>({
        secret: configService.get<string>('SECRET_JWT'),
        signOptions: {expiresIn: '24h'},
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy, PrismaService, UserService],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}