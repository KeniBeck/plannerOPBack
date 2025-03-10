import { Module } from '@nestjs/common';
import { OperationsCronService } from './cron-job.service'; 
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateOperationService } from './services/update-operation';
import { UpdateWorkerService } from './services/update-worker';


@Module({
  providers: [OperationsCronService, PrismaService, UpdateOperationService, UpdateWorkerService],
  exports: [OperationsCronService, PrismaService],
})
export class CronJobModule {}