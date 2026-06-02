import { Module } from '@nestjs/common';
import { TrackingEventsController } from './tracking-events.controller';
import { TrackingEventsService } from './tracking-events.service';
import { TrackingEventsRepository } from './tracking-events.repository';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [TrackingEventsController],
  providers: [TrackingEventsRepository, TrackingEventsService],
  exports: [TrackingEventsService],
})
export class TrackingEventsModule {}
