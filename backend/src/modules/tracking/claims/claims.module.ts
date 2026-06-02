import { Module } from '@nestjs/common';
import { ClaimsController } from './claims.controller';
import { ClaimsService } from './claims.service';
import { ClaimsRepository } from './claims.repository';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ClaimsController],
  providers: [ClaimsRepository, ClaimsService],
  exports: [ClaimsService],
})
export class ClaimsModule {}
