import { Module } from '@nestjs/common';
import { RolePrivilegesController } from './role-privileges.controller';
import { RolePrivilegesService } from './role-privileges.service';
import { RolePrivilegesRepository } from './role-privileges.repository';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [RolePrivilegesController],
  providers: [RolePrivilegesRepository, RolePrivilegesService],
  exports: [RolePrivilegesService],
})
export class RolePrivilegesModule {}
