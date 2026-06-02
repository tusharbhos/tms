import { Module } from '@nestjs/common';
import { SecurityEventsController } from './security-events.controller';
import { SecurityEventsService } from './security-events.service';
import { SecurityEventsRepository } from './security-events.repository';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [SecurityEventsController],
  providers: [SecurityEventsRepository, SecurityEventsService],
  exports: [SecurityEventsService],
})
export class SecurityEventsModule {}
