import { Module } from '@nestjs/common';
import { StatusMasterController } from './status-master.controller';
import { StatusMasterService } from './status-master.service';
import { StatusMasterRepository } from './status-master.repository';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [StatusMasterController],
  providers: [StatusMasterRepository, StatusMasterService],
  exports: [StatusMasterService],
})
export class StatusMasterModule {}
