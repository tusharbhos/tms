import { Module } from '@nestjs/common';
import { StatusChangeLogsController } from './status-change-logs.controller';
import { StatusChangeLogsService } from './status-change-logs.service';
import { StatusChangeLogsRepository } from './status-change-logs.repository';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [StatusChangeLogsController],
  providers: [StatusChangeLogsRepository, StatusChangeLogsService],
  exports: [StatusChangeLogsService],
})
export class StatusChangeLogsModule {}
