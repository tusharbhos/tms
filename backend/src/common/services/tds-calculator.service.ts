import { Injectable } from '@nestjs/common';

// 194C TDS: 1% for individual/HUF, 2% for companies.
@Injectable()
export class TdsCalculatorService {
  compute(hireCharges: number, vendorEntityType: 'individual' | 'company') {
    const rate = vendorEntityType === 'individual' ? 0.01 : 0.02;
    return { tdsRate: rate, tdsAmount: +(hireCharges * rate).toFixed(2) };
  }
}
