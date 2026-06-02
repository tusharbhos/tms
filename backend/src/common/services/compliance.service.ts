import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

// ComplianceGate — blocks vehicle/driver assignment if any document expired
// or the vendor is blacklisted. Called before manifest/trip dispatch.
@Injectable()
export class ComplianceService {
  constructor(private readonly prisma: PrismaService) {}

  async assertAssignable(tenantId: number, vehicleId: number, driverId: number, vendorId?: number) {
    const today = new Date();
    const errors: string[] = [];

    const v = await this.prisma.vehicles.findFirst({ where: { id: vehicleId, tenantId } });
    if (!v) errors.push('Vehicle not found');
    else {
      if (v.insuranceExpiry && v.insuranceExpiry <= today) errors.push('Vehicle insurance expired');
      if (v.fitnessCertExpiry && v.fitnessCertExpiry <= today) errors.push('Vehicle fitness expired');
      if (v.permitExpiry && v.permitExpiry <= today) errors.push('Vehicle permit expired');
      if (v.pollutionExpiry && v.pollutionExpiry <= today) errors.push('Pollution cert expired');
    }

    const d = await this.prisma.driver.findFirst({ where: { id: driverId, tenantId } });
    if (!d) errors.push('Driver not found');
    else if (d.dlExpiryDate && d.dlExpiryDate <= today) errors.push('Driver licence expired');

    if (vendorId) {
      const vendor = await this.prisma.vendor.findFirst({ where: { id: vendorId, tenantId } });
      if (vendor?.blacklistedFlag) errors.push('Vendor is blacklisted');
    }

    if (errors.length) throw new BadRequestException({ message: 'Compliance check failed', errors });
    return true;
  }
}
