import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Extracts tenantId from the JWT payload (set on req.user by JwtAuthGuard).
 * Use with @CurrentTenant() in controllers.
 */
export const CurrentTenant = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): number => {
    const req = ctx.switchToHttp().getRequest();
    return req.user?.tenantId ?? req.tenantId;
  },
);
