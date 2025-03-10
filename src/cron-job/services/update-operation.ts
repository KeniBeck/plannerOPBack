import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { differenceInMinutes } from 'date-fns';

@Injectable()
export class UpdateOperationService {
  private readonly logger = new Logger(UpdateOperationService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Actualiza las operaciones de estado PENDING a INPROGRESS cuando hayan pasado 5 minutos
   * desde la hora de inicio programada.
   */
  async updateInProgressOperations() {
    try {
      this.logger.debug('Checking for operations to update to INPROGRESS...');

      const now = new Date();
      
      // Crear fecha de inicio (hoy a medianoche)
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      // Crear fecha de fin (mañana a medianoche)
      const endOfDay = new Date(startOfDay);
      endOfDay.setDate(startOfDay.getDate() + 1);
      
      this.logger.debug(`Searching operations for date: ${startOfDay.toISOString()}`);

      // Buscar todas las operaciones con estado PENDING para hoy
      const pendingOperations = await this.prisma.operation.findMany({
        where: {
          dateStart: {
            gte: startOfDay, // Mayor o igual que hoy a medianoche
            lt: endOfDay,    // Menor que mañana a medianoche
          },
          status: 'PENDING',
        },
      });

      this.logger.debug(`Found ${pendingOperations.length} pending operations`);
      
      let updatedCount = 0;

      for (const operation of pendingOperations) {
        // Crear la fecha de inicio completa combinando dateStart y timeStrat
        const dateStartStr = operation.dateStart.toISOString().split('T')[0];
        const startDateTime = new Date(`${dateStartStr}T${operation.timeStrat}`);

        // Verificar si han pasado 5 minutos desde la hora de inicio
        const minutesDiff = differenceInMinutes(now, startDateTime);
        this.logger.debug(`Operation ${operation.id}: ${minutesDiff} minutes since start time`);

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
        this.logger.debug(`Updated ${updatedCount} operations to INPROGRESS status`);
      }

      return { updatedCount };
    } catch (error) {
      this.logger.error('Error updating operations:', error);
      throw error;
    }
  }

  async updateCompletedOperations() {
    try {
      this.logger.debug('Checking for operations to update to COMPLETED...');

      const now = new Date();
      
      // Crear fecha de inicio (hoy a medianoche)
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      // Crear fecha de fin (mañana a medianoche)
      const endOfDay = new Date(startOfDay);
      endOfDay.setDate(startOfDay.getDate() + 1);
      
      this.logger.debug(`Searching operations for date: ${startOfDay.toISOString()}`);

      // Buscar todas las operaciones con estado INPROGRESS para hoy que tengan fecha de finalización
      const inProgressOperations = await this.prisma.operation.findMany({
        where: {
          dateEnd: {
            gte: startOfDay, // Mayor o igual que hoy a medianoche
            lt: endOfDay,    // Menor que mañana a medianoche
          },
          status: 'INPROGRESS',
          timeEnd: {
            not: null, // Asegurarse de que tienen una hora de finalización
          },
        },
      });

      this.logger.debug(`Found ${inProgressOperations.length} in-progress operations with end time`);
      
      let updatedCount = 0;

      for (const operation of inProgressOperations) {
        // Verificar que tenemos todos los datos necesarios
        if (!operation.dateEnd || !operation.timeEnd) {
          this.logger.warn(`Operation ${operation.id} has missing end date or time`);
          continue;
        }

        // Crear la fecha de finalización completa combinando dateEnd y timeEnd
        const dateEndStr = operation.dateEnd.toISOString().split('T')[0];
        const endDateTime = new Date(`${dateEndStr}T${operation.timeEnd}`);

        // Verificar si han pasado 10 minutos desde la hora de finalización
        const minutesDiff = differenceInMinutes(now, endDateTime);
        this.logger.debug(`Operation ${operation.id}: ${minutesDiff} minutes since end time`);

        if (minutesDiff >= 10) {
          // Actualizar el estado a COMPLETED
          await this.prisma.operation.update({
            where: { id: operation.id },
            data: { status: 'COMPLETED' },
          });
          updatedCount++;
        }
      }

      if (updatedCount > 0) {
        this.logger.debug(`Updated ${updatedCount} operations to COMPLETED status`);
      }

      return { updatedCount };
    } catch (error) {
      this.logger.error('Error updating completed operations:', error);
      throw error;
    }
  }
}