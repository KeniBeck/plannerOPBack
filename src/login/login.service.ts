import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateLoginDto } from './dto/create-login.dto';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class LoginService {
  constructor(private authService: AuthService) {}
  async login(createLoginDto: CreateLoginDto) {
    try {
      const user = await this.authService.validateUser(
        createLoginDto.username,
        createLoginDto.password,
      );

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }
      const token = this.authService.generateToken(user);
      return token;
    } catch (error) {
      throw new Error(error);
    }
  }

  async logout(token: string) {
    try {
      await this.authService.invalidateToken(token);
      return 'Logout successful';
    } catch (error) {
      throw new Error(error);
    }
  }
}
