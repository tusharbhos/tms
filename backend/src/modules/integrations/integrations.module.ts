import { ApiIntegrationsModule } from './api-integrations/api-integrations.module';
import { ApiIntegrationLogsModule } from './api-integration-logs/api-integration-logs.module';
import { WebhookConfigsModule } from './webhook-configs/webhook-configs.module';
import { WebhookLogsModule } from './webhook-log-store/webhook-logs.module';
import { ApiProviderConfigModule } from './api-provider-config/api-provider-config.module';
import { ApiSyncJobsModule } from './sync-jobs/api-sync-jobs.module';
import { ApiWebhookLogsModule } from './webhook-logs/api-webhook-logs.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    ApiIntegrationsModule,
    ApiIntegrationLogsModule,
    WebhookConfigsModule,
    WebhookLogsModule,
    ApiProviderConfigModule,
    ApiSyncJobsModule,
    ApiWebhookLogsModule
  ],
})
export class IntegrationsModule {}
