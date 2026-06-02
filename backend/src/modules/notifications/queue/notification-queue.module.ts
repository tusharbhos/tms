import { Module } from '@nestjs/common';
import { NotificationQueueController } from './notification-queue.controller';
import { NotificationQueueService } from './notification-queue.service';
import { NotificationQueueRepository } from './notification-queue.repository';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [NotificationQueueController],
  providers: [NotificationQueueRepository, NotificationQueueService],
  exports: [NotificationQueueService],
})
export class NotificationQueueModule {}
