import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
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
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
