import { Module } from '@nestjs/common';
import { WebhookLogsController } from './webhook-logs.controller';
import { WebhookLogsService } from './webhook-logs.service';
import { WebhookLogsRepository } from './webhook-logs.repository';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [WebhookLogsController],
  providers: [WebhookLogsRepository, WebhookLogsService],
  exports: [WebhookLogsService],
})
export class WebhookLogsModule {}
