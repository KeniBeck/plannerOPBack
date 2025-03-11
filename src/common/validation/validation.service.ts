import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ValidationService {
  constructor(
    private prisma: PrismaService,
  ) {}

  /**
   * Valida que todos los IDs proporcionados existan en la base de datos
   * @param params - Objeto con los IDs y valores a validar
   * @returns Objeto con resultado de la validación (success: true) o mensaje de error
   */
  async validateAllIds({
    id_user,
    id_area,
    id_task,
    id_client,
    code_worker,
    dni_worker,
    workerIds,
    phone_worker,
  }: {
    id_user?: number;
    id_area?: number;
    id_task?: number;
    id_client?: number;
    dni_worker?: string;
    code_worker?: string;
    phone_worker?: string;
    workerIds?: number[];
  }) {
    try {
      // 1. Validar usuario si se proporciona
      if (id_user !== undefined) {
        const user = await this.prisma.user.findUnique({
          where: { id: id_user },
        });
        
        if (!user) {
          return { message: 'User not found', status: 404 };
        }
      }

      // 2. Validar área si se proporciona
      if (id_area !== undefined) {
        const area = await this.prisma.jobArea.findUnique({
          where: { id: id_area },
        });
        
        if (!area) {
          return { message: 'Area not found', status: 404 };
        }
      }

      // 3. Validar tarea si se proporciona
      if (id_task !== undefined) {
        const task = await this.prisma.task.findUnique({
          where: { id: id_task },
        });
        
        if (!task) {
          return { message: 'Task not found', status: 404 };
        }
      }

      // 4. Validar cliente si se proporciona
      if (id_client !== undefined) {
        const client = await this.prisma.client.findUnique({
          where: { id: id_client },
        });
        
        if (!client) {
          return { message: 'Client not found', status: 404 };
        }
      }

      // 5. Validar código si se proporciona
      if (code_worker !== undefined) {
        console.log('Validating code_worker:', code_worker);
        const existingWorkerWithCode = await this.prisma.worker.findUnique({
          where: { code: code_worker },
        });
        
        if (existingWorkerWithCode) {
          console.log('Found existing worker with code:', existingWorkerWithCode.id);
          return { message: 'Code already exists', status: 409 };
        }
      }

      // 6. Validar DNI si se proporciona
      if (dni_worker !== undefined) {
        console.log('Validating DNI:', dni_worker);
        const existingWorkerWithDNI = await this.prisma.worker.findUnique({
          where: { dni: dni_worker },
        });
        
        if (existingWorkerWithDNI) {
          console.log('Found existing worker with DNI:', existingWorkerWithDNI.id);
          return { message: 'Worker with this DNI already exists', status: 409 };
        }
      }

      // 7. Validar teléfono si se proporciona
      if (phone_worker !== undefined) {
        console.log('Validating phone:', phone_worker);
        const existingWorkerWithPhone = await this.prisma.worker.findUnique({
          where: { phone: phone_worker },
        });
        
        if (existingWorkerWithPhone) {
          console.log('Found existing worker with phone:', existingWorkerWithPhone.id);
          return { message: 'Phone already exists', status: 409 };
        }
      }

      // 8. Validar que todos los trabajadores existan si se proporcionan IDs
      if (workerIds && workerIds.length > 0) {
        console.log('Validating worker IDs:', workerIds);
        const existingWorkers = await this.prisma.worker.findMany({
          where: {
            id: {
              in: workerIds,
            },
          },
          select: {
            id: true,
          },
        });

        const existingWorkerIds = existingWorkers.map((worker) => worker.id);
        const nonExistingWorkerIds = workerIds.filter(
          (workerId) => !existingWorkerIds.includes(workerId)
        );

        if (nonExistingWorkerIds.length > 0) {
          console.log('Workers not found:', nonExistingWorkerIds);
          return {
            message: `Workers not found: ${nonExistingWorkerIds.join(', ')}`,
            status: 404,
          };
        }
      }

      // Todos los IDs son válidos
      return { success: true };
    } catch (error) {
      console.error('Error validating IDs:', error);
      throw new Error(`Error validating IDs: ${error.message}`);
    }
  }

  /**
   * Valida que un trabajador esté asignado a una operación
   * @param operationId - ID de la operación
   * @param workerId - ID del trabajador
   * @returns Objeto indicando si la relación existe o mensaje de error
   */
  async validateWorkerInOperation(operationId: number, workerId: number) {
    try {
      console.log('Validating worker in operation:', { operationId, workerId });
      
      // Verificar que la operación existe
      const operation = await this.prisma.operation.findUnique({
        where: { id: operationId },
      });

      if (!operation) {
        console.log('Operation not found:', operationId);
        return { message: 'Operation not found', status: 404 };
      }

      // Verificar que el trabajador existe
      const worker = await this.prisma.worker.findUnique({
        where: { id: workerId },
      });

      if (!worker) {
        console.log('Worker not found:', workerId);
        return { message: 'Worker not found', status: 404 };
      }

      // Verificar la relación entre trabajador y operación
      const relation = await this.prisma.operation_Worker.findFirst({
        where: {
          id_operation: operationId,
          id_worker: workerId,
        },
      });

      if (!relation) {
        console.log('Relation not found between operation and worker');
        return {
          message: `Worker ${workerId} is not assigned to operation ${operationId}`,
          status: 404,
        };
      }

      console.log('Worker is assigned to operation');
      return { success: true };
    } catch (error) {
      console.error('Error validating worker in operation:', error);
      throw new Error(`Error validating worker-operation relation: ${error.message}`);
    }
  }

  /**
   * Verifica si un código de trabajador ya existe
   * @param code - Código a verificar
   * @returns true si ya existe, false si no
   */
  async workerCodeExists(code: string): Promise<boolean> {
    try {
      const existingWorker = await this.prisma.worker.findUnique({
        where: { code },
      });
      return !!existingWorker;
    } catch (error) {
      console.error('Error checking if worker code exists:', error);
      throw new Error(`Error checking worker code: ${error.message}`);
    }
  }

  /**
   * Verifica si un DNI de trabajador ya existe
   * @param dni - DNI a verificar
   * @returns true si ya existe, false si no
   */
  async workerDniExists(dni: string): Promise<boolean> {
    try {
      const existingWorker = await this.prisma.worker.findUnique({
        where: { dni },
      });
      return !!existingWorker;
    } catch (error) {
      console.error('Error checking if worker DNI exists:', error);
      throw new Error(`Error checking worker DNI: ${error.message}`);
    }
  }

  /**
   * Verifica si un teléfono de trabajador ya existe
   * @param phone - Teléfono a verificar
   * @returns true si ya existe, false si no
   */
  async workerPhoneExists(phone: string): Promise<boolean> {
    try {
      const existingWorker = await this.prisma.worker.findUnique({
        where: { phone },
      });
      return !!existingWorker;
    } catch (error) {
      console.error('Error checking if worker phone exists:', error);
      throw new Error(`Error checking worker phone: ${error.message}`);
    }
  }
}