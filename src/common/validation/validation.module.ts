import { Module } from '@nestjs/common';
import { ValidationService } from './validation.service';
import { PrismaService } from 'src/prisma/prisma.service';


@Module({
 
  providers: [ValidationService, PrismaService],
  exports: [ValidationService],
})
export class ValidationModule {}