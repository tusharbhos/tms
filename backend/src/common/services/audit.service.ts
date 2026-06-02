import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

/** Reusable audit-log writer — immutable. */
@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async log(params: {
    tenantId?: number;
    userId?: number;
    action: string;
    entityType?: string;
    entityId?: string;
    oldValues?: any;
    newValues?: any;
    ipAddress?: string;
    userAgent?: string;
  }) {
    try {
      await this.prisma.activityLogs.create({
        data: {
          tenantId: params.tenantId,
          userId: params.userId,
          action: params.action,
          tableName: params.entityType,
          recordId: params.entityId ? BigInt(params.entityId) : null,
          oldValuesJson: params.oldValues ?? null,
          newValuesJson: params.newValues ?? null,
          ipAddress: params.ipAddress,
          browserInfo: params.userAgent,
        },
      });
    } catch (e) {
      // never let audit failure break the main flow
      console.error('[Audit] failed:', e);
    }
  }
}
