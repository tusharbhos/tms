import { Module } from '@nestjs/common';
import { CpKycController } from './cp-kyc.controller';
import { CpKycService } from './cp-kyc.service';
import { CpKycRepository } from './cp-kyc.repository';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [CpKycController],
  providers: [CpKycRepository, CpKycService],
  exports: [CpKycService],
})
export class CpKycModule {}
