import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';


@Injectable()
export class AuthService {
  constructor(
    private user: UserService,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  // Validar usuario por credenciales
  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.user.findByUsername(username);
    if (user && await this.comparePassword(password, user.password)) {
      // Excluir contraseña de la respuesta
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  // Generar token JWT para el usuario
  generateToken(user: any) {
    const payload = {
      id: user.id,
      username: user.username,
      role: user.role,
      dni: user.dni,
      occupation: user.occupation,
      phone: user.phone,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // Comparar contraseña plana con hash
  async comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    try {
      // Para usuarios existentes (sin hash) - Implementación temporal
      if (plainPassword === hashedPassword) {
        return true;
      }
      
      // Para contraseñas hasheadas
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      return false;
    }
  }

  // Hash de contraseña para nuevo registro
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  decodeToken(token: string) {
    try {
      // Eliminar 'Bearer ' si está presente
      const tokenValue = token.replace('Bearer ', '');
      // Decodificar el token
      const decodedToken = this.jwtService.decode(tokenValue);
      return {
        decoded: decodedToken,
        valid: !!decodedToken
      };
    } catch (error) {
      return {
        decoded: null,
        valid: false,
        error: error.message
      };
    }
  }

  async invalidateToken(token: string) {
    try {
      // Decodificar token para obtener su tiempo de expiración
      const decoded = this.jwtService.decode(token) as { exp: number };
      
      if (!decoded) {
        throw new Error('Invalid token');
      }
      
      // Calcular tiempo restante de validez
      const expiration = decoded.exp * 1000; // Convertir a milisegundos
      const now = Date.now();
      const ttl = Math.floor((expiration - now) / 1000); // Segundos hasta expiración
      
      if (ttl > 0) {
        // Añadir token a lista negra hasta su expiración natural
        await this.cacheManager.set(`blacklist:${token}`, true, ttl);
      }
      
      return true;
    } catch (error) {
      console.error('Error invalidating token:', error);
      return false;
    }
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    return !!(await this.cacheManager.get(`blacklist:${token}`));
  }
}

