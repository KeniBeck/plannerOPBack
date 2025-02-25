import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaService } from './prisma/prisma.service';
import { AreaModule } from './area/area.module';

@Module({
  imports: [UserModule, AreaModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
