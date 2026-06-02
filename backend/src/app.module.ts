import { AuditModule } from './modules/audit/audit.module';
import { ConfigModule } from './modules/config/config.module';
import { FinanceModule } from './modules/finance/finance.module';
import { IamModule } from './modules/iam/iam.module';
import { IntegrationsModule } from './modules/integrations/integrations.module';
import { MastersModule } from './modules/masters/masters.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { OperationsModule } from './modules/operations/operations.module';
import { TenantModule } from './modules/tenant/tenant.module';
import { TrackingModule } from './modules/tracking/tracking.module';
import { VaultModule } from './modules/vault/vault.module';
import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { DatabaseModule } from './database/database.module';
import { CommonModule } from './common/common.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { PrivilegeGuard } from './common/guards/privilege.guard';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

@Module({
  imports: [
    DatabaseModule,
    CommonModule,
    AuditModule,
    ConfigModule,
    FinanceModule,
    IamModule,
    IntegrationsModule,
    MastersModule,
    NotificationsModule,
    OperationsModule,
    TenantModule,
    TrackingModule,
    VaultModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: PrivilegeGuard },
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
  ],
})
export class AppModule {}
