import { Module } from '@nestjs/common';
import { StatusAutomationRulesController } from './status-automation-rules.controller';
import { StatusAutomationRulesService } from './status-automation-rules.service';
import { StatusAutomationRulesRepository } from './status-automation-rules.repository';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [StatusAutomationRulesController],
  providers: [StatusAutomationRulesRepository, StatusAutomationRulesService],
  exports: [StatusAutomationRulesService],
})
export class StatusAutomationRulesModule {}
