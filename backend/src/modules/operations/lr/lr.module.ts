import { Module } from '@nestjs/common';
import { LrController } from './lr.controller';
import { LrService } from './lr.service';
import { LrRepository } from './lr.repository';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [LrController],
  providers: [LrRepository, LrService],
  exports: [LrService],
})
export class LrModule {}
