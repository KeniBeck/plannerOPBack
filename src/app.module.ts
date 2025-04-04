import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PrismaService } from './prisma/prisma.service';
import { AreaModule } from './area/area.module';
import { LoginModule } from './login/login.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { WorkerModule } from './worker/worker.module';
import { TaskModule } from './task/task.module';
import { OperationModule } from './operation/operation.module';
import { CronJobModule } from './cron-job/cron-job.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ClientModule } from './client/client.module';
import { ValidationModule } from './common/validation/validation.module';
import { CalledAttentionModule } from './called-attention/called-attention.module';
import { OperationWorkerModule } from './operation-worker/operation-worker.module';
import { OperationInChargeModule } from './in-charged/in-charged.module';



@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    CronJobModule,
    UserModule,
    AreaModule,
    LoginModule,
    AuthModule,
    WorkerModule,
    TaskModule,
    OperationModule,
    CronJobModule,
    ClientModule,
    ValidationModule,
    CalledAttentionModule,
    OperationWorkerModule,
    OperationInChargeModule,
  ],
  providers: [ PrismaService],
})
export class AppModule {}
