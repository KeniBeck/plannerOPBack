import { Module } from '@nestjs/common';
import { WorkerService } from './worker.service';
import { WorkerController } from './worker.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { AreaService } from 'src/area/area.service';
import { UserService } from 'src/user/user.service';

@Module({
  controllers: [WorkerController],
  providers: [WorkerService, PrismaService, AreaService, UserService],
})
export class WorkerModule {}
