import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

// Ensures every request carries a tenant context. The actual row-level
// filtering happens in each repository (WHERE tenantId = ...).
@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest();
    if (!req.tenantId) throw new ForbiddenException('No tenant context');
    return true;
  }
}
