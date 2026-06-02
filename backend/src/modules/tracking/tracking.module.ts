import { TrackingEventsModule } from './tracking-events/tracking-events.module';
import { VehicleLocationLogsModule } from './vehicle-location/vehicle-location-logs.module';
import { PackageScanLogsModule } from './package-scan/package-scan-logs.module';
import { ExceptionLogsModule } from './exceptions/exception-logs.module';
import { IncidentsModule } from './incidents/incidents.module';
import { IncidentDocumentsModule } from './incident-documents/incident-documents.module';
import { IncidentActionsModule } from './incident-actions/incident-actions.module';
import { ClaimsModule } from './claims/claims.module';
import { StatusChangeLogsModule } from './status-change-logs/status-change-logs.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    TrackingEventsModule,
    VehicleLocationLogsModule,
    PackageScanLogsModule,
    ExceptionLogsModule,
    IncidentsModule,
    IncidentDocumentsModule,
    IncidentActionsModule,
    ClaimsModule,
    StatusChangeLogsModule
  ],
})
export class TrackingModule {}
