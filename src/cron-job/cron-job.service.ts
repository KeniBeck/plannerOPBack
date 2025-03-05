import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';
import { add, parseISO, differenceInMinutes } from 'date-fns';

@Injectable()
export class OperationsCronService {
  private readonly logger = new Logger(OperationsCronService.name);

  constructor(private prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async updateInProgressOperations() {
    try {
      this.logger.debug('Checking for operations to update to INPROGRESS...');

      const now = new Date();

      // Buscar todas las operaciones con estado PENDING
      const pendingOperations = await this.prisma.operation.findMany({
        where: {
          status: 'PENDING',
        },
      });

      let updatedCount = 0;

      for (const operation of pendingOperations) {
        // Crear la fecha de inicio completa combinando dateStart y timeStrat
        const dateStartStr = operation.dateStart.toISOString().split('T')[0];
        const startDateTime = new Date(
          `${dateStartStr}T${operation.timeStrat}`,
        );

        // Verificar si han pasado 5 minutos desde la hora de inicio
        const minutesDiff = differenceInMinutes(now, startDateTime);
        console.log('minutesDiff', minutesDiff);

        if (minutesDiff >= 5) {
          // Actualizar el estado a INPROGRESS
          await this.prisma.operation.update({
            where: { id: operation.id },
            data: { status: 'INPROGRESS' },
          });
          updatedCount++;
        }
      }

      if (updatedCount > 0) {
        this.logger.debug(
          `Updated ${updatedCount} operations to INPROGRESS status`,
        );
      }
    } catch (error) {
      this.logger.error('Error updating operations:', error);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async updateDateDisableWorker() {
    try {
      this.logger.debug('Checking for workers to update to AVALIABLE...');

      // Obtener la fecha actual sin la hora
      const now = new Date();
      const currentDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
      );

      // Obtener la fecha de ayer para comparar con dateDisableEnd
      const yesterday = new Date(currentDate);
      yesterday.setDate(yesterday.getDate() - 1);

      this.logger.debug(
        `Current date: ${currentDate.toISOString()}, comparing with end dates <= ${yesterday.toISOString()}`,
      );

      // Buscar trabajadores incapacitados cuya fecha de fin de incapacidad ya pasó (fue ayer o antes)
      const disabledWorkers = await this.prisma.worker.findMany({
        where: {
          status: 'DISABLE',
          dateDisableEnd: {
            lte: yesterday, // Menor o igual que ayer (no hoy)
          },
        },
      });

      this.logger.debug(`Found ${disabledWorkers.length} workers to update`);

      let updatedCount = 0;

      for (const worker of disabledWorkers) {
        this.logger.debug(
          `Updating worker ${worker.id} with disable end date: ${worker.dateDisableEnd}`,
        );

        // Actualizar estado a AVALIABLE
        await this.prisma.worker.update({
          where: { id: worker.id },
          data: {
            status: 'AVALIABLE',
            dateDisableStart: null,
            dateDisableEnd: null,
          },
        });
        updatedCount++;
      }

      if (updatedCount > 0) {
        this.logger.debug(
          `Updated ${updatedCount} workers from DISABLE to AVALIABLE status`,
        );
      }
    } catch (error) {
      this.logger.error('Error updating disabled workers:', error);
    }
  }
}
