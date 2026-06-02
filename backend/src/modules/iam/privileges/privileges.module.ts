import { Module } from '@nestjs/common';
import { PrivilegesController } from './privileges.controller';
import { PrivilegesService } from './privileges.service';
import { PrivilegesRepository } from './privileges.repository';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [PrivilegesController],
  providers: [PrivilegesRepository, PrivilegesService],
  exports: [PrivilegesService],
})
export class PrivilegesModule {}
