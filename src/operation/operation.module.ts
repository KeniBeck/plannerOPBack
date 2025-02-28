import { Module } from '@nestjs/common';
import { OperationService } from './operation.service';
import { OperationController } from './operation.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [OperationController],
  providers: [OperationService, PrismaService],
})
export class OperationModule {}
