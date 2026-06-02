import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { CreateVehicleLocationLogsDto } from './dto/create-vehicle-location-logs.dto';
import { UpdateVehicleLocationLogsDto } from './dto/update-vehicle-location-logs.dto';
import { FilterVehicleLocationLogsDto } from './dto/filter-vehicle-location-logs.dto';

// Repository — all DB access for `txn_vehicle_location_logs`.
// Tenant isolation (RLS) is enforced: every query is scoped by tenantId.
@Injectable()
export class VehicleLocationLogsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: number, userId: number, dto: CreateVehicleLocationLogsDto) {
    return this.prisma.vehicleLocationLogs.create({
      data: { ...dto, tenantId, createdBy: userId } as any,
    });
  }

  async findAll(tenantId: number, query: FilterVehicleLocationLogsDto) {
    const { page, size, search, status, includeDeleted } = query;
    const where: any = { tenantId,  };
    
    if (status) where.status = status;
    const [rows, total] = await Promise.all([
      this.prisma.vehicleLocationLogs.findMany({
        where,
        skip: (page - 1) * size,
        take: size,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.vehicleLocationLogs.count({ where }),
    ]);
    return { rows, total, page, size, pages: Math.ceil(total / size) };
  }

  async findOne(tenantId: number, id: string | number) {
    return this.prisma.vehicleLocationLogs.findFirst({
      where: { id: BigInt(id) as any, tenantId },
    });
  }

  // txn_vehicle_location_logs is an IMMUTABLE LOG — no update/delete permitted by design.
}
