import { Module } from '@nestjs/common';
import { PodController } from './pod.controller';
import { PodService } from './pod.service';
import { PodRepository } from './pod.repository';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [PodController],
  providers: [PodRepository, PodService],
  exports: [PodService],
})
export class PodModule {}
