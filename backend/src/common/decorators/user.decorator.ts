import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Extracts user (or specific user field) from req.user (set by JwtAuthGuard).
 * @CurrentUser()        → entire payload
 * @CurrentUser('sub')   → user id
 * @CurrentUser('roleId') → role id
 */
export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const user = req.user;
    if (!user) return undefined;
    if (data === 'id') return user.sub;  // alias
    return data ? user[data] : user;
  },
);
