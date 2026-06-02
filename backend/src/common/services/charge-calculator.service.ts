import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { GstCalculatorService } from './gst-calculator.service';

// ChargeCalculator — turns a booking's weight + route into freight + taxes.
// Mirrors the TMS rules: slab pick -> excess weight -> ODA -> GST.
@Injectable()
export class ChargeCalculatorService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gst: GstCalculatorService,
  ) {}

  async compute(params: {
    tenantId: number;
    contractId: number;
    originHubId: number;
    destHubId: number;
    chargeableWeight: number;
    isOda: boolean;
    sameState: boolean;
  }) {
    const { tenantId, contractId, originHubId, destHubId, chargeableWeight, isOda, sameState } = params;
    const custContractId = BigInt(contractId);
    const fromPlaceId = BigInt(originHubId);
    const toPlaceId = BigInt(destHubId);

    // 1. find the weight slab
    const slab = await this.prisma.custContractSlabDefinition.findFirst({
      where: {
        tenantId,
        custContractId,
        slabLowerLimit: { lte: chargeableWeight },
        slabUpperLimit: { gte: chargeableWeight },
        isActive: true,
      },
      orderBy: { slabLowerLimit: 'asc' },
    });

    let freight = 0;
    if (slab) {
      const rate = await this.prisma.custContractSlabRates.findFirst({
        where: { tenantId, custContractId, fromPlaceId, toPlaceId, isActive: true },
      });
      if (!rate) throw new BadRequestException('No rate for this lane/slab');
      const slabRateKey = `slab${slab.slabNumber}` as keyof typeof rate;
      const slabRate = rate[slabRateKey];
      if (slabRate == null) throw new BadRequestException('No rate for this lane/slab');
      freight = Number(slabRate) * chargeableWeight;
    } else {
      // over the top slab -> excess weight rate
      const excess = await this.prisma.custContractExcessWeight.findFirst({ where: { tenantId, custContractId, isActive: true } });
      if (!excess) throw new BadRequestException('No excess-weight rate configured');
      freight = Number(excess.rate) * chargeableWeight;
    }

    // 2. ODA surcharge
    let oda = 0;
    if (isOda) {
      const odaRow = await this.prisma.custContractOdaCharges.findFirst({
        where: { tenantId, custContractId, fromPlaceId, toPlaceId, isActive: true },
      });
      oda = odaRow ? Number(odaRow.rate) : 0;
    }

    // 3. GST
    const taxable = freight + oda;
    const tax = this.gst.split(taxable, sameState);

    return {
      freightCharges: freight,
      odaCharges: oda,
      ...tax,
      totalCharges: taxable + tax.gstTotal,
    };
  }
}
