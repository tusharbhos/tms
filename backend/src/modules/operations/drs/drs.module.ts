import { Module } from '@nestjs/common';
import { DrsController } from './drs.controller';
import { DrsService } from './drs.service';
import { DrsRepository } from './drs.repository';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [DrsController],
  providers: [DrsRepository, DrsService],
  exports: [DrsService],
})
export class DrsModule {}
