import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { REQUIRE_PRIVILEGE } from '../decorators/privilege.decorator';

/**
 * Checks the user has the required privilege.
 * The JWT payload carries the privilege list (loaded at login).
 * Pair with @RequirePrivilege('masters.create') on any endpoint.
 */
@Injectable()
export class PrivilegeGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<string>(REQUIRE_PRIVILEGE, [
      ctx.getHandler(), ctx.getClass(),
    ]);
    if (!required) return true;

    const req = ctx.switchToHttp().getRequest();
    const privileges: string[] = req.user?.privileges ?? [];
    // wildcard support: "masters.*" grants all masters actions
    const ok = privileges.includes(required)
      || privileges.includes(required.split('.')[0] + '.*')
      || privileges.includes('*');
    if (!ok) {
      throw new ForbiddenException(`Missing privilege: ${required}. You have: [${privileges.join(', ') || 'none'}]`);
    }
    return true;
  }
}
