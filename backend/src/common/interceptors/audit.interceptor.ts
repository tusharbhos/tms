import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { tap, Observable } from 'rxjs';
import { PrismaService } from '../../database/prisma.service';

// Writes a row to activity_logs for every mutating request (POST/PATCH/DELETE).
@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly prisma: PrismaService) {}

  intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
    const req = ctx.switchToHttp().getRequest();
    const mutating = ['POST', 'PATCH', 'PUT', 'DELETE'].includes(req.method);
    return next.handle().pipe(
      tap(() => {
        if (!mutating || !req.tenantId) return;
        this.prisma.activityLogs.create({
          data: {
            tenantId: req.tenantId,
            userId: req.user?.id ?? null,
            action: `${req.method} ${req.route?.path ?? req.url}`,
            tableName: req.route?.path?.split('/')[1] ?? null,
            ipAddress: req.ip,
            createdBy: req.user?.id ?? null,
          },
        }).catch(() => void 0);
      }),
    );
  }
}
