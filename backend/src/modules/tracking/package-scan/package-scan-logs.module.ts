import { Module } from '@nestjs/common';
import { PackageScanLogsController } from './package-scan-logs.controller';
import { PackageScanLogsService } from './package-scan-logs.service';
import { PackageScanLogsRepository } from './package-scan-logs.repository';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [PackageScanLogsController],
  providers: [PackageScanLogsRepository, PackageScanLogsService],
  exports: [PackageScanLogsService],
})
export class PackageScanLogsModule {}
