import { Module } from '@nestjs/common';
import { OperationService } from './operation.service';
import { OperationController } from './operation.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { AreaService } from 'src/area/area.service';
import { TaskService } from 'src/task/task.service';

@Module({
  controllers: [OperationController],
  providers: [OperationService, PrismaService, UserService, AreaService, TaskService],
})
export class OperationModule {}
