import { forwardRef, Module } from '@nestjs/common';
import { WorkerService } from './worker.service';
import { WorkerController } from './worker.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ValidationModule } from 'src/common/validation/validation.module';

@Module({
  imports: [forwardRef (()=> ValidationModule) ],
  controllers: [WorkerController],
  providers: [WorkerService, PrismaService],
})
export class WorkerModule {}
