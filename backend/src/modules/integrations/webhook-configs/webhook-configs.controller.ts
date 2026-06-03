import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, Res, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '../../../common/decorators/public.decorator';
import { ExcelService, ColumnDef  } from '../../../common/services/excel.service';
import { WebhookConfigsService } from './webhook-configs.service';
import { CreateWebhookConfigsSchema, CreateWebhookConfigsDto } from './dto/create-webhook-configs.dto';
import { UpdateWebhookConfigsSchema, UpdateWebhookConfigsDto } from './dto/update-webhook-configs.dto';
import { FilterWebhookConfigsSchema, FilterWebhookConfigsDto } from './dto/filter-webhook-configs.dto';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../../common/guards/tenant.guard';
import { CurrentTenant } from '../../../common/decorators/tenant.decorator';
import { CurrentUser } from '../../../common/decorators/user.decorator';

@UseGuards(JwtAuthGuard, TenantGuard)
@ApiTags('integrations/webhook-configs')
@ApiBearerAuth()
@Controller('integrations/webhook-configs')
export class WebhookConfigsController {
  constructor(private readonly service: WebhookConfigsService,
    private readonly excelService: ExcelService) {}

  @Post()
  create(
    @CurrentTenant() tenantId: number,
    @CurrentUser('id') userId: number,
    @Body(new ZodValidationPipe(CreateWebhookConfigsSchema)) dto: CreateWebhookConfigsDto,
  ) {
    return this.service.create(tenantId, userId, dto);
  }

  @Get()
  findAll(
    @CurrentTenant() tenantId: number,
    @Query(new ZodValidationPipe(FilterWebhookConfigsSchema)) query: FilterWebhookConfigsDto,
  ) {
    return this.service.findAll(tenantId, query);
  }

  @Get(':id(\\d+)')
  findOne(@CurrentTenant() tenantId: number, @Param('id') id: string) {
    return this.service.findOne(tenantId, id);
  }

  @Patch(':id(\\d+)')
  update(
    @CurrentTenant() tenantId: number,
    @CurrentUser('id') userId: number,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateWebhookConfigsSchema)) dto: UpdateWebhookConfigsDto,
  ) {
    return this.service.update(tenantId, userId, id, dto);
  }

  @Delete(':id(\\d+)')
  remove(
    @CurrentTenant() tenantId: number,
    @CurrentUser('id') userId: number,
    @Param('id') id: string,
  ) {
    return this.service.remove(tenantId, userId, id);
  }

  // ───────── Excel import / export ─────────
  private readonly excelColumns: ColumnDef[] = [
    { key: 'name', label: 'Name', type: 'string' },
    { key: 'description', label: 'Description', type: 'string' },
    { key: 'url', label: 'Url', type: 'string' },
    { key: 'method', label: 'Method', type: 'string' },
    { key: 'authType', label: 'Auth Type', type: 'string' },
    { key: 'authConfig', label: 'Auth Config', type: 'string' },
    { key: 'customHeaders', label: 'Custom Headers', type: 'string' },
    { key: 'events', label: 'Events', type: 'string' },
    { key: 'payloadFormat', label: 'Payload Format', type: 'string' },
    { key: 'payloadTemplate', label: 'Payload Template', type: 'string' },
    { key: 'timeoutSeconds', label: 'Timeout Seconds', type: 'number' },
    { key: 'maxRetries', label: 'Max Retries', type: 'number' },
    { key: 'retryDelaySeconds', label: 'Retry Delay Seconds', type: 'number' },
    { key: 'signingSecret', label: 'Signing Secret', type: 'string' },
    { key: 'isActive', label: 'Is Active', type: 'boolean' },
    { key: 'lastTriggeredAt', label: 'Last Triggered At', type: 'date' },
    { key: 'lastStatus', label: 'Last Status', type: 'string' }
  ];
  private readonly excelSheetName = 'webhook_configs';

  @Public()
  @Get('template')
  @ApiOperation({ summary: 'Download blank Excel template' })
  async downloadTemplate(@Res() res: any) {
    const buf = await this.excelService.buildTemplate(this.excelSheetName, this.excelColumns);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="webhook_configs_template.xlsx"`);
    res.send(buf);
  }

  @Get('export')
  @ApiOperation({ summary: 'Export current data as Excel' })
  async exportExcel(
    @CurrentTenant() tenantId: number,
    @Query() query: any,
    @Res() res: any,
  ) {
    const result: any = await this.service.findAll(tenantId, this.excelService.normalizeExportQuery(query));
    const rows = Array.isArray(result) ? result : (result?.data ?? result?.rows ?? []);
    const buf = await this.excelService.buildExport(this.excelSheetName, this.excelColumns, rows);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="webhook_configs_${Date.now()}.xlsx"`);
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
