import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    const jwtSecret = configService.get<string>('SECRET_JWT');
    if (!jwtSecret) {
      throw new Error('JWT secret not found');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: any) {
    return { 
      userId: payload.id, 
      username: payload.username, 
      role: payload.role,
      dni: payload.dni,
      occupation: payload.occupation,
      phone: payload.phone,
    };
  }
}