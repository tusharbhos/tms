import { Module } from '@nestjs/common';
import { ChannelPartnerController } from './channel-partner.controller';
import { ChannelPartnerService } from './channel-partner.service';
import { ChannelPartnerRepository } from './channel-partner.repository';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ChannelPartnerController],
  providers: [ChannelPartnerRepository, ChannelPartnerService],
  exports: [ChannelPartnerService],
})
export class ChannelPartnerModule {}
