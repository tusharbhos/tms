import { Module } from '@nestjs/common';
import { WebhookConfigsController } from './webhook-configs.controller';
import { WebhookConfigsService } from './webhook-configs.service';
import { WebhookConfigsRepository } from './webhook-configs.repository';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [WebhookConfigsController],
  providers: [WebhookConfigsRepository, WebhookConfigsService],
  exports: [WebhookConfigsService],
})
export class WebhookConfigsModule {}
