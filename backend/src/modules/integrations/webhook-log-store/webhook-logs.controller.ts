import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, Res, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '../../../common/decorators/public.decorator';
import { ExcelService, ColumnDef  } from '../../../common/services/excel.service';
import { WebhookLogsService } from './webhook-logs.service';
import { CreateWebhookLogsSchema, CreateWebhookLogsDto } from './dto/create-webhook-logs.dto';
import { UpdateWebhookLogsSchema, UpdateWebhookLogsDto } from './dto/update-webhook-logs.dto';
import { FilterWebhookLogsSchema, FilterWebhookLogsDto } from './dto/filter-webhook-logs.dto';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../../common/guards/tenant.guard';
import { CurrentTenant } from '../../../common/decorators/tenant.decorator';
import { CurrentUser } from '../../../common/decorators/user.decorator';

@UseGuards(JwtAuthGuard, TenantGuard)
@ApiTags('integrations/webhook-log-store')
@ApiBearerAuth()
@Controller('integrations/webhook-log-store')
export class WebhookLogsController {
  constructor(private readonly service: WebhookLogsService,
    private readonly excelService: ExcelService) {}

  @Post()
  create(
    @CurrentTenant() tenantId: number,
    @CurrentUser('id') userId: number,
    @Body(new ZodValidationPipe(CreateWebhookLogsSchema)) dto: CreateWebhookLogsDto,
  ) {
    return this.service.create(tenantId, userId, dto);
  }

  @Get()
  findAll(
    @CurrentTenant() tenantId: number,
    @Query(new ZodValidationPipe(FilterWebhookLogsSchema)) query: FilterWebhookLogsDto,
  ) {
    return this.service.findAll(tenantId, query);
  }

  @Get(':id')
  findOne(@CurrentTenant() tenantId: number, @Param('id') id: string) {
    return this.service.findOne(tenantId, id);
  }

  // ───────── Excel import / export ─────────
  private readonly excelColumns: ColumnDef[] = [
    { key: 'webhookConfigId', label: 'Webhook Config Id', type: 'number' },
    { key: 'eventCode', label: 'Event Code', type: 'string' },
    { key: 'entityType', label: 'Entity Type', type: 'string' },
    { key: 'entityId', label: 'Entity Id', type: 'number' },
    { key: 'attemptNumber', label: 'Attempt Number', type: 'number' },
    { key: 'parentLogId', label: 'Parent Log Id', type: 'number' },
    { key: 'url', label: 'Url', type: 'string' },
    { key: 'method', label: 'Method', type: 'string' },
    { key: 'requestHeaders', label: 'Request Headers', type: 'string' },
    { key: 'requestPayload', label: 'Request Payload', type: 'string' },
    { key: 'responseStatus', label: 'Response Status', type: 'number' },
    { key: 'responseBody', label: 'Response Body', type: 'string' },
    { key: 'durationMs', label: 'Duration Ms', type: 'number' },
    { key: 'isSuccess', label: 'Is Success', type: 'boolean' },
    { key: 'errorMessage', label: 'Error Message', type: 'string' },
    { key: 'triggeredAt', label: 'Triggered At', type: 'date' },
    { key: 'nextRetryAt', label: 'Next Retry At', type: 'date' }
  ];
  private readonly excelSheetName = 'webhook_logs';

  @Public()
  @Get('template')
  @ApiOperation({ summary: 'Download blank Excel template' })
  async downloadTemplate(@Res() res: any) {
    const buf = await this.excelService.buildTemplate(this.excelSheetName, this.excelColumns);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="webhook_logs_template.xlsx"`);
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
    res.setHeader('Content-Disposition', `attachment; filename="webhook_logs_${Date.now()}.xlsx"`);
    res.send(buf);
  }

}
