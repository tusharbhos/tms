import { Injectable } from '@nestjs/common';

// GST split: same-state => SGST + CGST, inter-state => IGST. Default 18%.
@Injectable()
export class GstCalculatorService {
  split(taxable: number, sameState: boolean, ratePct = 18) {
    const gstTotal = +(taxable * (ratePct / 100)).toFixed(2);
    if (sameState) {
      const half = +(gstTotal / 2).toFixed(2);
      return { sgst: half, cgst: half, igst: 0, gstTotal };
    }
    return { sgst: 0, cgst: 0, igst: gstTotal, gstTotal };
  }
}
