import { DocumentsModule } from './documents/documents.module';
import { AddressesModule } from './addresses/addresses.module';
import { DocumentTypesModule } from './document-types/document-types.module';
import { ContactPersonsModule } from './contact-persons/contact-persons.module';
import { BankAccountsModule } from './bank-accounts/bank-accounts.module';
import { TaxRegistrationsModule } from './tax-registrations/tax-registrations.module';
import { DocumentVerificationsModule } from './document-verifications/document-verifications.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    DocumentsModule,
    AddressesModule,
    DocumentTypesModule,
    ContactPersonsModule,
    BankAccountsModule,
    TaxRegistrationsModule,
    DocumentVerificationsModule
  ],
})
export class VaultModule {}
