import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, Res, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '../../../common/decorators/public.decorator';
import { ExcelService, ColumnDef  } from '../../../common/services/excel.service';
import { NotificationQueueService } from './notification-queue.service';
import { CreateNotificationQueueSchema, CreateNotificationQueueDto } from './dto/create-notification-queue.dto';
import { UpdateNotificationQueueSchema, UpdateNotificationQueueDto } from './dto/update-notification-queue.dto';
import { FilterNotificationQueueSchema, FilterNotificationQueueDto } from './dto/filter-notification-queue.dto';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../../common/guards/tenant.guard';
import { CurrentTenant } from '../../../common/decorators/tenant.decorator';
import { CurrentUser } from '../../../common/decorators/user.decorator';

@UseGuards(JwtAuthGuard, TenantGuard)
@ApiTags('notifications/queue')
@ApiBearerAuth()
@Controller('notifications/queue')
export class NotificationQueueController {
  constructor(private readonly service: NotificationQueueService,
    private readonly excelService: ExcelService) {}

  @Post()
  create(
    @CurrentTenant() tenantId: number,
    @CurrentUser('id') userId: number,
    @Body(new ZodValidationPipe(CreateNotificationQueueSchema)) dto: CreateNotificationQueueDto,
  ) {
    return this.service.create(tenantId, userId, dto);
  }

  @Get()
  findAll(
    @CurrentTenant() tenantId: number,
    @Query(new ZodValidationPipe(FilterNotificationQueueSchema)) query: FilterNotificationQueueDto,
  ) {
    return this.service.findAll(tenantId, query);
  }

  @Get(':id')
  findOne(@CurrentTenant() tenantId: number, @Param('id') id: string) {
    return this.service.findOne(tenantId, id);
  }

  @Patch(':id')
  update(
    @CurrentTenant() tenantId: number,
    @CurrentUser('id') userId: number,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateNotificationQueueSchema)) dto: UpdateNotificationQueueDto,
  ) {
    return this.service.update(tenantId, userId, id, dto);
  }

  @Delete(':id')
  remove(
    @CurrentTenant() tenantId: number,
    @CurrentUser('id') userId: number,
    @Param('id') id: string,
  ) {
    return this.service.remove(tenantId, userId, id);
  }

  // ───────── Excel import / export ─────────
  private readonly excelColumns: ColumnDef[] = [
    { key: 'eventCode', label: 'Event Code', type: 'string' },
    { key: 'entityType', label: 'Entity Type', type: 'string' },
    { key: 'entityId', label: 'Entity Id', type: 'number' },
    { key: 'channel', label: 'Channel', type: 'string' },
    { key: 'templateId', label: 'Template Id', type: 'number' },
    { key: 'recipientMobile', label: 'Recipient Mobile', type: 'string' },
    { key: 'recipientEmail', label: 'Recipient Email', type: 'string' },
    { key: 'message', label: 'Message', type: 'string' },
    { key: 'variablesJson', label: 'Variables Json', type: 'string' },
    { key: 'status', label: 'Status', type: 'string' },
    { key: 'provider', label: 'Provider', type: 'string' },
    { key: 'providerMsgId', label: 'Provider Msg Id', type: 'string' },
    { key: 'retryCount', label: 'Retry Count', type: 'number' },
    { key: 'scheduledAt', label: 'Scheduled At', type: 'date' },
    { key: 'sentAt', label: 'Sent At', type: 'date' },
    { key: 'errorMessage', label: 'Error Message', type: 'string' },
    { key: 'maxRetry', label: 'Max Retry', type: 'number' },
    { key: 'nextRetryAt', label: 'Next Retry At', type: 'date' },
    { key: 'webhookRequired', label: 'Webhook Required', type: 'boolean' }
  ];
  private readonly excelSheetName = 'txn_notification_queue';

  @Public()
  @Get('template')
  @ApiOperation({ summary: 'Download blank Excel template' })
  async downloadTemplate(@Res() res: any) {
    const buf = await this.excelService.buildTemplate(this.excelSheetName, this.excelColumns);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="txn_notification_queue_template.xlsx"`);
    res.send(buf);
  }

  @Get('export')
  @ApiOperation({ summary: 'Export current data as Excel' })
  async exportExcel(
    @CurrentTenant() tenantId: number,
    @Query() query: any,
    @Res() res: any,
  ) {
    const result: any = await this.service.findAll(tenantId, { ...query, size: 10000 });
    const rows = Array.isArray(result) ? result : (result?.data ?? result?.rows ?? []);
    const buf = await this.excelService.buildExport(this.excelSheetName, this.excelColumns, rows);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="txn_notification_queue_${Date.now()}.xlsx"`);
    res.send(buf);
  }

  @Post('import')
  @ApiOperation({ summary: 'Bulk-import rows from Excel' })
  @UseInterceptors(FileInterceptor('file'))
  async importExcel(
    @CurrentTenant() tenantId: number,
    @CurrentUser('sub') userId: number,
    @UploadedFile() file: any,
  ) {
    if (!file) throw new BadRequestException('Upload an .xlsx file as "file"');
    const parsed = await this.excelService.parseImport(file.buffer, this.excelColumns);
    if (!parsed.ok) return { ok: false, errors: parsed.errors, imported: 0 };
    let imported = 0;
    const errors: any[] = [];
    for (let i = 0; i < parsed.rows.length; i++) {
      try {
        await this.service.create(tenantId, userId, parsed.rows[i] as any);
        imported++;
      } catch (e: any) {
        errors.push({ row: i + 2, message: e.message });
      }
    }
    return { ok: errors.length === 0, imported, total: parsed.rows.length, errors };
  }
}
