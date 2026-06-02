import { Global, Module } from '@nestjs/common';
import { PasswordService } from './services/password.service';
import { OtpService } from './services/otp.service';
import { ExcelService } from './services/excel.service';
import { AuditService } from './services/audit.service';
import { ChargeCalculatorService } from './services/charge-calculator.service';
import { GstCalculatorService } from './services/gst-calculator.service';
import { TdsCalculatorService } from './services/tds-calculator.service';
import { ComplianceService } from './services/compliance.service';
import { DatabaseModule } from '../database/database.module';

@Global()
@Module({
  imports: [DatabaseModule],
  providers: [
    PasswordService,
    OtpService,
    ExcelService,
    AuditService,
    ChargeCalculatorService,
    GstCalculatorService,
    TdsCalculatorService,
    ComplianceService,
  ],
  exports: [
    PasswordService,
    OtpService,
    ExcelService,
    AuditService,
    ChargeCalculatorService,
    GstCalculatorService,
    TdsCalculatorService,
    ComplianceService,
  ],
})
export class CommonModule {}
