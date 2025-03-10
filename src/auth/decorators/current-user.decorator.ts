import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    
    // Si se proporciona una clave específica, devuelve ese valor
    if (data) {
      return request.user[data];
    }
    
    // De lo contrario, devuelve todo el objeto usuario
    return request.user;
  },
);