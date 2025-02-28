import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthService } from '../auth.service';
@Injectable()
export class JwtBlacklistGuard extends JwtAuthGuard {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Primero verifica con el JwtAuthGuard estándar
    const canActivate = await super.canActivate(context);
    
    if (!canActivate) {
      return false;
    }
    
    // Si es válido, verifica que no esté en la lista negra
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];
    
    if (token && await this.authService.isTokenBlacklisted(token)) {
      throw new UnauthorizedException('Token has been invalidated');
    }
    
    return true;
  }
}