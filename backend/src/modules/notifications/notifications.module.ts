import { NotificationTemplatesModule } from './templates/notification-templates.module';
import { NotificationLogsModule } from './logs/notification-logs.module';
import { NotificationQueueModule } from './queue/notification-queue.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    NotificationTemplatesModule,
    NotificationLogsModule,
    NotificationQueueModule
  ],
})
export class NotificationsModule {}
