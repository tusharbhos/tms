import { NumberSeriesConfigModule } from './number-series/number-series-config.module';
import { StatusMasterModule } from './status-master/status-master.module';
import { ReasonMasterModule } from './reason-master/reason-master.module';
import { IncidentTypeMasterModule } from './incident-type-master/incident-type-master.module';
import { IncidentActionMasterModule } from './incident-action-master/incident-action-master.module';
import { PrintTemplatesModule } from './print-templates/print-templates.module';
import { StatusAutomationRulesModule } from './status-automation/status-automation-rules.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    NumberSeriesConfigModule,
    StatusMasterModule,
    ReasonMasterModule,
    IncidentTypeMasterModule,
    IncidentActionMasterModule,
    PrintTemplatesModule,
    StatusAutomationRulesModule
  ],
})
export class ConfigModule {}
