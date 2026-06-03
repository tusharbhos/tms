import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

// Wraps every response in a consistent envelope and converts BigInt -> string.
@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(_ctx: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (data === undefined) return data;
        return {
          success: true,
          data: JSON.parse(JSON.stringify(data, (_k, v) =>
            typeof v === 'bigint' ? v.toString() : v,
          )),
        };
      }),
    );
  }
}
