import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class ToLowerCasePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    // Si no es un objeto o es nulo, no hacemos nada
    if (!value || typeof value !== 'object') {
      return value;
    }
    
    // Creamos una copia para no modificar el objeto original
    const transformedValue = { ...value };
    
    // Recorremos todas las propiedades
    for (const key in transformedValue) {
      // Si la propiedad es un string, la convertimos a minúsculas
      if (typeof transformedValue[key] === 'string') {
        transformedValue[key] = transformedValue[key].toLowerCase().trim();
      }
    }
    
    return transformedValue;
  }
}