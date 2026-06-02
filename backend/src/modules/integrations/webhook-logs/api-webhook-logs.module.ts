import { Module } from '@nestjs/common';
import { ApiWebhookLogsController } from './api-webhook-logs.controller';
import { ApiWebhookLogsService } from './api-webhook-logs.service';
import { ApiWebhookLogsRepository } from './api-webhook-logs.repository';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ApiWebhookLogsController],
  providers: [ApiWebhookLogsRepository, ApiWebhookLogsService],
  exports: [ApiWebhookLogsService],
})
export class ApiWebhookLogsModule {}
