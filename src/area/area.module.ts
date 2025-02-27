import { Module } from '@nestjs/common';
import { AreaService } from './area.service';
import { AreaController } from './area.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';
import { WorkerModule } from 'src/worker/worker.module';

@Module({
  controllers: [AreaController],
  providers: [AreaService, PrismaService, UserService],
})
export class AreaModule {}
