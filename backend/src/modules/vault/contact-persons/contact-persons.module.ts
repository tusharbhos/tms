import { Module } from '@nestjs/common';
import { ContactPersonsController } from './contact-persons.controller';
import { ContactPersonsService } from './contact-persons.service';
import { ContactPersonsRepository } from './contact-persons.repository';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ContactPersonsController],
  providers: [ContactPersonsRepository, ContactPersonsService],
  exports: [ContactPersonsService],
})
export class ContactPersonsModule {}
