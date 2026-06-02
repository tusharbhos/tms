import { Module } from '@nestjs/common';
import { ExceptionLogsController } from './exception-logs.controller';
import { ExceptionLogsService } from './exception-logs.service';
import { ExceptionLogsRepository } from './exception-logs.repository';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ExceptionLogsController],
  providers: [ExceptionLogsRepository, ExceptionLogsService],
  exports: [ExceptionLogsService],
})
export class ExceptionLogsModule {}
