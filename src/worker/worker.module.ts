import { Module } from '@nestjs/common';
import { WorkerService } from './worker.service';
import { WorkerController } from './worker.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [WorkerController],
  providers: [WorkerService, PrismaService],
})
export class WorkerModule {}
