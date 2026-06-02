import { Module } from '@nestjs/common';
import { ApiProviderConfigController } from './api-provider-config.controller';
import { ApiProviderConfigService } from './api-provider-config.service';
import { ApiProviderConfigRepository } from './api-provider-config.repository';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ApiProviderConfigController],
  providers: [ApiProviderConfigRepository, ApiProviderConfigService],
  exports: [ApiProviderConfigService],
})
export class ApiProviderConfigModule {}
