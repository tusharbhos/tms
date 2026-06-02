import { Module } from '@nestjs/common';
import { DrsLrsController } from './drs-lrs.controller';
import { DrsLrsService } from './drs-lrs.service';
import { DrsLrsRepository } from './drs-lrs.repository';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [DrsLrsController],
  providers: [DrsLrsRepository, DrsLrsService],
  exports: [DrsLrsService],
})
export class DrsLrsModule {}
