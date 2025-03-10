import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UpdateWorkerService {
  private readonly logger = new Logger(UpdateWorkerService.name);

  constructor(private prisma: PrismaService) {}

  async updateDisabledWorkers() {
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
      
      return { updatedCount };
    } catch (error) {
      this.logger.error('Error updating disabled workers:', error);
      throw error;
    }
  }
}