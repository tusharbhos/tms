import { Module } from '@nestjs/common';
import { PrnController } from './prns.controller';
import { PrnService } from './prns.service';
import { PrnRepository } from './prns.repository';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [PrnController],
  providers: [PrnRepository, PrnService],
  exports: [PrnService],
})
export class PrnModule {}
