import { PrivilegesModule } from './privileges/privileges.module';
import { RoleModule } from './roles/role.module';
import { RolePrivilegesModule } from './role-privileges/role-privileges.module';
import { UsersModule } from './users/users.module';
import { UserOtpsModule } from './user-otps/user-otps.module';
import { DepartmentsModule } from './departments/departments.module';
import { UserSessionsModule } from './sessions/user-sessions.module';
import { LoginAttemptsModule } from './login-attempts/login-attempts.module';
import { SecurityEventsModule } from './security-events/security-events.module';
import { AuthModule } from './auth/auth.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    AuthModule,
    PrivilegesModule,
    RoleModule,
    RolePrivilegesModule,
    UsersModule,
    UserOtpsModule,
    DepartmentsModule,
    UserSessionsModule,
    LoginAttemptsModule,
    SecurityEventsModule
  ],
})
export class IamModule {}
