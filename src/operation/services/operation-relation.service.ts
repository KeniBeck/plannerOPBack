import { Injectable } from '@nestjs/common';
import { WorkerScheduleDto } from 'src/operation-worker/dto/worker-schedule.dto';
import { OperationWorkerService } from 'src/operation-worker/operation-worker.service';
import { OperationInChargeService } from 'src/in-charged/in-charged.service';
import { UpdateOperationDto } from '../dto/update-operation.dto';
import { ValidationService } from 'src/common/validation/validation.service';

/**
 * Servicio para gestionar relaciones de operaciones
 */
@Injectable()
export class OperationRelationService {
  constructor(
    private operationWorkerService: OperationWorkerService,
    private operationInChargeService: OperationInChargeService,
    private validationService: ValidationService,
  ) {}

/**
 * Asigna trabajadores y encargados a una operación
 * @param operationId - ID de la operación
 * @param workerIds - IDs de trabajadores simples
 * @param workersWithSchedule - Grupos de trabajadores programados
 * @param inChargedIds - IDs de encargados
 */
async assignWorkersAndInCharge(
  operationId: number,
  workerIds: number[] = [],
  workersWithSchedule: WorkerScheduleDto[] = [],
  inChargedIds: number[] = [],
) {
  // Eliminar duplicados
  const uniqueWorkerIds = [...new Set(workerIds)];
  const uniqueInChargedIds = [...new Set(inChargedIds)];

  // Eliminar duplicados en los trabajadores con programación
  const uniqueWorkersWithSchedule: WorkerScheduleDto[] = [];
  const processedWorkers = new Set();

  // Procesar cada grupo de trabajadores con programación
  for (const schedule of workersWithSchedule) {
    if (schedule.workerIds && Array.isArray(schedule.workerIds)) {
      // Filtrar IDs duplicados dentro del mismo grupo
      const uniqueIds = [...new Set(schedule.workerIds)];

      // Filtrar trabajadores que ya aparecen en otras programaciones
      const filteredIds = uniqueIds.filter(id => !processedWorkers.has(id));

      // Si hay trabajadores únicos, agregar el grupo
      if (filteredIds.length > 0) {
        uniqueWorkersWithSchedule.push({
          ...schedule,
          workerIds: filteredIds
        });

        // Marcar estos trabajadores como procesados
        filteredIds.forEach(id => processedWorkers.add(id));
      }
    }
  }

  // Filtrar también trabajadores simples que ya están en grupos con programación
  const filteredWorkerIds = uniqueWorkerIds.filter(id => !processedWorkers.has(id));

  const hasWorkers = filteredWorkerIds.length > 0 || uniqueWorkersWithSchedule.length > 0;
  const hasInCharge = uniqueInChargedIds && uniqueInChargedIds.length > 0;

  // Asignar trabajadores
  if (hasWorkers) {
    await this.operationWorkerService.assignWorkersToOperation({
      id_operation: operationId,
      workerIds: filteredWorkerIds,
      workersWithSchedule: uniqueWorkersWithSchedule,
    });
  }

  // Asignar encargados
  if (hasInCharge) {
    await this.operationInChargeService.assignInChargeToOperation({
      id_operation: operationId,
      userIds: uniqueInChargedIds,
    });
  }
}
  /**
   * Extrae los IDs de trabajadores de grupos programados
   * @param workersWithSchedule - Grupos de trabajadores programados
   * @returns Array de IDs de trabajadores
   */
  extractScheduledWorkerIds(workersWithSchedule: WorkerScheduleDto[] = []): number[] {
    const ids: number[] = [];
    
    if (!workersWithSchedule.length) return ids;
    
    workersWithSchedule.forEach(group => {
      if (group.workerIds && Array.isArray(group.workerIds)) {
        ids.push(...group.workerIds);
      }
    });
    
    return ids;
  }

  /**
   * Valida los IDs para una operación
   * @param ids - Objeto con los IDs a validar
   * @returns Mensaje de error o null si todo es válido
   */
  async validateOperationIds(ids: any) {
    const validation = await this.validationService.validateAllIds(ids);
    
    if (validation && 'status' in validation && validation.status === 404) {
      return validation;
    }
    
    return null;
  }

  /**
   * Valida los IDs de encargados en la actualización
   * @param updateDto - DTO de actualización
   * @returns Mensaje de error o null si es válido
   */
  async validateInChargedIds(updateDto: UpdateOperationDto) {
    if (!updateDto.inCharged?.connect?.length) return null;
    
    const inChargedIds = updateDto.inCharged.connect.map(item => item.id);
    const validateIds = await this.validationService.validateAllIds({ inChargedIds });
    
    if (validateIds && 'status' in validateIds && validateIds.status === 404) {
      return validateIds;
    }
    
    return null;
  }

  /**
   * Procesa las actualizaciones de relaciones (trabajadores y encargados)
   * @param operationId - ID de la operación
   * @param workers - Datos de actualización de trabajadores
   * @param inCharged - Datos de actualización de encargados
   */
  async processRelationUpdates(operationId: number, workers?: any, inCharged?: any) {
    // Procesar actualizaciones de trabajadores
    if (workers) {
      await this.processWorkerUpdates(operationId, workers);
    }

    // Procesar actualizaciones de encargados
    if (inCharged) {
      await this.processInChargedUpdates(operationId, inCharged);
    }
  }

  /**
   * Procesa las actualizaciones de trabajadores
   * @param operationId - ID de la operación
   * @param workers - Datos de actualización de trabajadores
   */
  private async processWorkerUpdates(operationId: number, workers: any) {
    // Conectar nuevos trabajadores
    if (workers.connect?.length) {
      const { simpleWorkers, scheduledGroups } = this.separateWorkerTypes(workers.connect);
      
      if (simpleWorkers.length > 0 || scheduledGroups.length > 0) {
        await this.operationWorkerService.assignWorkersToOperation({
          id_operation: operationId,
          workerIds: simpleWorkers,
          workersWithSchedule: scheduledGroups,
        });
      }
    }

    // Desconectar trabajadores
    if (workers.disconnect?.length) {
      const workerIds = workers.disconnect.map(item => item.id);
      
      if (workerIds.length > 0) {
        await this.operationWorkerService.removeWorkersFromOperation({
          id_operation: operationId,
          workerIds,
        });
      }
    }

    // Actualizar programación de trabajadores
    if (workers.update?.length) {
      await this.operationWorkerService.updateWorkersSchedule(
        operationId,
        workers.update,
      );
    }
  }

  /**
   * Separa trabajadores en simples y programados
   * @param workers - Trabajadores a separar
   * @returns Objeto con trabajadores simples y programados
   */
  private separateWorkerTypes(workers: any[]) {
    const simpleWorkers: number[] = [];
    const scheduledGroups: WorkerScheduleDto[] = [];

    for (const item of workers) {
      if ('workerIds' in item && Array.isArray(item.workerIds)) {
        scheduledGroups.push({
          workerIds: item.workerIds,
          dateStart: item.dateStart,
          dateEnd: item.dateEnd,
          timeStart: item.timeStart,
          timeEnd: item.timeEnd,
        });
      } else if ('id' in item && typeof item.id === 'number') {
        simpleWorkers.push(item.id);
      }
    }

    return { simpleWorkers, scheduledGroups };
  }

  /**
   * Procesa las actualizaciones de encargados
   * @param operationId - ID de la operación
   * @param inCharged - Datos de actualización de encargados
   */
  private async processInChargedUpdates(operationId: number, inCharged: any) {
    // Conectar encargados
    if (inCharged.connect?.length) {
      const inChargedIds = inCharged.connect.map(item => item.id);
      
      if (inChargedIds.length > 0) {
        await this.operationInChargeService.assignInChargeToOperation({
          id_operation: operationId,
          userIds: inChargedIds,
        });
      }
    }

    // Desconectar encargados
    if (inCharged.disconnect?.length) {
      const inChargedIds = inCharged.disconnect.map(item => item.id);
      
      if (inChargedIds.length > 0) {
        await this.operationInChargeService.removeInChargeFromOperation({
          id_operation: operationId,
          userIds: inChargedIds,
        });
      }
    }
  }
}