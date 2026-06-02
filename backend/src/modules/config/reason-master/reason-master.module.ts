import { Module } from '@nestjs/common';
import { ReasonMasterController } from './reason-master.controller';
import { ReasonMasterService } from './reason-master.service';
import { ReasonMasterRepository } from './reason-master.repository';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ReasonMasterController],
  providers: [ReasonMasterRepository, ReasonMasterService],
  exports: [ReasonMasterService],
})
export class ReasonMasterModule {}
