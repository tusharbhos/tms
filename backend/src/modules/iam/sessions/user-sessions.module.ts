import { Module } from '@nestjs/common';
import { UserSessionsController } from './user-sessions.controller';
import { UserSessionsService } from './user-sessions.service';
import { UserSessionsRepository } from './user-sessions.repository';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [UserSessionsController],
  providers: [UserSessionsRepository, UserSessionsService],
  exports: [UserSessionsService],
})
export class UserSessionsModule {}
