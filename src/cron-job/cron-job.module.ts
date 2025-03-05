import { Module } from '@nestjs/common';
import { OperationsCronService } from './cron-job.service'; 
import { PrismaService } from 'src/prisma/prisma.service';


@Module({
  providers: [OperationsCronService, PrismaService],
  exports: [OperationsCronService, PrismaService],
})
export class CronJobModule {}