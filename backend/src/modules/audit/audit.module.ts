import { ActivityLogsModule } from './activity-logs/activity-logs.module';
import { ScheduledJobsModule } from './scheduled-jobs/scheduled-jobs.module';
import { DashboardsModule } from './dashboards/dashboards.module';
import { DashboardWidgetsModule } from './dashboard-widgets/dashboard-widgets.module';
import { ApprovalRequestsModule } from './approval-requests/approval-requests.module';
import { ApprovalStepsModule } from './approval-steps/approval-steps.module';
import { ApprovalActionLogsModule } from './approval-action-logs/approval-action-logs.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    ActivityLogsModule,
    ScheduledJobsModule,
    DashboardsModule,
    DashboardWidgetsModule,
    ApprovalRequestsModule,
    ApprovalStepsModule,
    ApprovalActionLogsModule
  ],
})
export class AuditModule {}
