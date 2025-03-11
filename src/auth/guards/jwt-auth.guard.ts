import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(protected reflector: Reflector, protected configService: ConfigService) {
    super();
  }
  
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    // Verificar si la ruta está marcada como pública
    const isPublic = this.reflector.getAllAndOverride<boolean>(this.configService.get<string>('SECRET_JWT'), [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (isPublic) {
      return true;
    }
    
    return super.canActivate(context);
  }
  
  handleRequest(err, user, info) {
    // Si hay un error o no hay usuario
    if (err || !user) {
      throw err || new UnauthorizedException('No autorizado');
    }
    
    // Retornar el usuario sin modificar para mantener la funcionalidad original
    return user;
  }
}