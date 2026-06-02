import { Module } from '@nestjs/common';
import { UserOtpsController } from './user-otps.controller';
import { UserOtpsService } from './user-otps.service';
import { UserOtpsRepository } from './user-otps.repository';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [UserOtpsController],
  providers: [UserOtpsRepository, UserOtpsService],
  exports: [UserOtpsService],
})
export class UserOtpsModule {}
