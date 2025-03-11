import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

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

      // Lista de campos de fecha que podrían necesitar transformación
      const dateFields = [
        'dateStart',
        'dateEnd',
        'dateDisableStart',
        'dateDisableEnd',
        'dateRetierment',
      ];

      // Procesar todos los campos de fecha
      for (const field of dateFields) {
        // Verificar si el campo existe y no está vacío
        if (
          result[field] !== undefined && 
          result[field] !== null && 
          result[field] !== ''
        ) {
          if (typeof result[field] === 'string') {
            if (!this.isValidDateFormat(result[field])) {
              throw new BadRequestException(
                `${field} debe tener formato YYYY-MM-DD: ${result[field]}`,
              );
            }
            // Convertir a objeto Date
            result[field] = new Date(result[field]);
          }
        } else if (result[field] === '') {
          // Si es una cadena vacía, asignar null para campos opcionales
          result[field] = null;
        }
      }

      // Lista de campos de hora que podrían necesitar validación
      const timeFields = ['timeStrat', 'timeEnd'];

      // Procesar todos los campos de hora
      for (const field of timeFields) {
        // Verificar si el campo existe y no está vacío
        if (
          result[field] !== undefined && 
          result[field] !== null && 
          result[field] !== ''
        ) {
          if (typeof result[field] === 'string') {
            if (!this.isValidTimeFormat(result[field])) {
              throw new BadRequestException(
                `${field} debe tener formato HH:MM: ${result[field]}`,
              );
            }
          }
        } else if (result[field] === '') {
          // Si es una cadena vacía, asignar null para campos opcionales
          result[field] = null;
        }
      }

      return result;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        `Error transformando fechas: ${error.message}`,
      );
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