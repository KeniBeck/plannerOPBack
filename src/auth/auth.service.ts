import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private user: UserService,
    private prisma: PrismaService,
    private jwtService: JwtService,
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
      sub: user.id,
      username: user.username,
      role: user.role,
      dni: user.dni
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
}