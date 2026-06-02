import { Module } from '@nestjs/common';
import { DashboardWidgetsController } from './dashboard-widgets.controller';
import { DashboardWidgetsService } from './dashboard-widgets.service';
import { DashboardWidgetsRepository } from './dashboard-widgets.repository';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [DashboardWidgetsController],
  providers: [DashboardWidgetsRepository, DashboardWidgetsService],
  exports: [DashboardWidgetsService],
})
export class DashboardWidgetsModule {}
