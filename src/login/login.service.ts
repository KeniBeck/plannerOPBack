import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateLoginDto } from './dto/create-login.dto';
import { AuthService } from 'src/auth/auth.service';
/**
 * Servicio para gestionar acesso a la aplicación
 * @class LoginService
 */
@Injectable()
export class LoginService {
  constructor(private authService: AuthService) {}
  /**
   * validar usuario
   * @param createLoginDto datos del usuario a validar
   * @returns resultado de la operación
   */
  async login(createLoginDto: CreateLoginDto) {
    try {
      const user = await this.authService.validateUser(
        createLoginDto.username,
        createLoginDto.password,
      );

      if (!user) {
        return "Invalid credentials";
      }
      const token = this.authService.generateToken(user);
      return token;
    } catch (error) {
      throw new Error(error);
    }
  }
  /**
   * salir de la aplicación
   * @param token token de acceso
   * @returns resultado de la operación
   */
  async logout(token: string) {
    try {
      await this.authService.invalidateToken(token);
      return 'Logout successful';
    } catch (error) {
      throw new Error(error);
    }
  }
}
