import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class DateTransformPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    // Si no hay valor o no es un objeto, retornar sin cambios
    if (!value || typeof value !== 'object') {
      return value;
    }

    try {
      // Crear una copia del objeto para no modificar el original
      const result = { ...value };

      // Procesar DateStart
      if (result.dateStart && typeof result.dateStart === 'string') {
        if (!this.isValidDateFormat(result.dateStart)) {
          throw new BadRequestException(`dateStart debe tener formato YYYY-MM-DD: ${result.dateStart}`);
        }
        // Convertir a objeto Date
        result.dateStart = new Date(result.dateStart);
      }

      // Procesar DateEnd
      if (result.dateEnd && typeof result.dateEnd === 'string') {
        if (!this.isValidDateFormat(result.dateEnd)) {
          throw new BadRequestException(`dateEnd debe tener formato YYYY-MM-DD: ${result.dateEnd}`);
        }
        // Convertir a objeto Date
        result.dateEnd = new Date(result.dateEnd);
      }

      // Procesar TimeStrat como string en formato HH:MM
      if (result.timeStrat && typeof result.timeStrat === 'string') {
        if (!this.isValidTimeFormat(result.timeStrat)) {
          throw new BadRequestException(`timeStrat debe tener formato HH:MM: ${result.timeStrat}`);
        }
        // Mantener como string para que Prisma lo maneje adecuadamente
        result.timeStrat = result.timeStrat;
      }

      // Procesar TimeEnd como string en formato HH:MM
      if (result.timeEnd && typeof result.timeEnd === 'string') {
        if (!this.isValidTimeFormat(result.timeEnd)) {
          throw new BadRequestException(`timeEnd debe tener formato HH:MM: ${result.timeEnd}`);
        }
        // Mantener como string para que Prisma lo maneje adecuadamente
        result.timeEnd = result.timeEnd;
      }

      return result;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Error transformando fechas: ${error.message}`);
    }
  }

  // Validar formato YYYY-MM-DD
  private isValidDateFormat(dateStr: string): boolean {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateStr)) {
      return false;
    }
    
    // Verificar que sea una fecha válida
    const date = new Date(dateStr);
    return date instanceof Date && !isNaN(date.getTime());
  }

  // Validar formato HH:MM
  private isValidTimeFormat(timeStr: string): boolean {
    const timeRegex = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;
    return timeRegex.test(timeStr);
  }
}