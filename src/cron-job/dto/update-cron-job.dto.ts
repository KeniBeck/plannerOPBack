import { PartialType } from '@nestjs/swagger';
import { CreateCronJobDto } from './create-cron-job.dto';

export class UpdateCronJobDto extends PartialType(CreateCronJobDto) {}
