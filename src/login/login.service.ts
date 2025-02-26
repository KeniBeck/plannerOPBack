import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateLoginDto } from './dto/create-login.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class LoginService {
  constructor(private authService: AuthService){}
  async create(createLoginDto: CreateLoginDto) {
    return 'This action adds a new login';
  }

  async login (createLoginDto: CreateLoginDto){
    const user = await this.authService.validateUser(createLoginDto.username, createLoginDto.password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
  const token = this.authService.generateToken(user);
  return {user,...token};
  
  }

  
}
