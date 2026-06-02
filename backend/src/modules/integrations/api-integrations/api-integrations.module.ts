import { Module } from '@nestjs/common';
import { ApiIntegrationsController } from './api-integrations.controller';
import { ApiIntegrationsService } from './api-integrations.service';
import { ApiIntegrationsRepository } from './api-integrations.repository';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ApiIntegrationsController],
  providers: [ApiIntegrationsRepository, ApiIntegrationsService],
  exports: [ApiIntegrationsService],
})
export class ApiIntegrationsModule {}
