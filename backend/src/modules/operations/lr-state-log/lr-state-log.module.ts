import { Module } from '@nestjs/common';
import { LrStateLogController } from './lr-state-log.controller';
import { LrStateLogService } from './lr-state-log.service';
import { LrStateLogRepository } from './lr-state-log.repository';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [LrStateLogController],
  providers: [LrStateLogRepository, LrStateLogService],
  exports: [LrStateLogService],
})
export class LrStateLogModule {}
