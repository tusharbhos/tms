import { SetMetadata } from '@nestjs/common';
export const REQUIRE_PRIVILEGE = 'requirePrivilege';
export const RequirePrivilege = (priv: string) => SetMetadata(REQUIRE_PRIVILEGE, priv);
