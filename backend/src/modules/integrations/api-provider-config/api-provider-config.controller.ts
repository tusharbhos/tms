import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, Res, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '../../../common/decorators/public.decorator';
import { ExcelService, ColumnDef  } from '../../../common/services/excel.service';
import { ApiProviderConfigService } from './api-provider-config.service';
import { CreateApiProviderConfigSchema, CreateApiProviderConfigDto } from './dto/create-api-provider-config.dto';
import { UpdateApiProviderConfigSchema, UpdateApiProviderConfigDto } from './dto/update-api-provider-config.dto';
import { FilterApiProviderConfigSchema, FilterApiProviderConfigDto } from './dto/filter-api-provider-config.dto';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../../common/guards/tenant.guard';
import { CurrentTenant } from '../../../common/decorators/tenant.decorator';
import { CurrentUser } from '../../../common/decorators/user.decorator';

@UseGuards(JwtAuthGuard, TenantGuard)
@ApiTags('integrations/api-provider-config')
@ApiBearerAuth()
@Controller('integrations/api-provider-config')
export class ApiProviderConfigController {
  constructor(private readonly service: ApiProviderConfigService,
    private readonly excelService: ExcelService) {}

  @Post()
  create(
    @CurrentTenant() tenantId: number,
    @CurrentUser('id') userId: number,
    @Body(new ZodValidationPipe(CreateApiProviderConfigSchema)) dto: CreateApiProviderConfigDto,
  ) {
    return this.service.create(tenantId, userId, dto);
  }

  @Get()
  findAll(
    @CurrentTenant() tenantId: number,
    @Query(new ZodValidationPipe(FilterApiProviderConfigSchema)) query: FilterApiProviderConfigDto,
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
    @Body(new ZodValidationPipe(UpdateApiProviderConfigSchema)) dto: UpdateApiProviderConfigDto,
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
    { key: 'providerType', label: 'Provider Type', type: 'string' },
    { key: 'providerName', label: 'Provider Name', type: 'string' },
    { key: 'providerCode', label: 'Provider Code', type: 'string' },
    { key: 'baseUrl', label: 'Base Url', type: 'string' },
    { key: 'apiKey', label: 'Api Key', type: 'string' },
    { key: 'apiSecret', label: 'Api Secret', type: 'string' },
    { key: 'username', label: 'Username', type: 'string' },
    { key: 'password', label: 'Password', type: 'string' },
    { key: 'authType', label: 'Auth Type', type: 'string' },
    { key: 'tokenEndpoint', label: 'Token Endpoint', type: 'string' },
    { key: 'webhookSecret', label: 'Webhook Secret', type: 'string' },
    { key: 'timeoutSeconds', label: 'Timeout Seconds', type: 'number' },
    { key: 'retryMax', label: 'Retry Max', type: 'number' },
    { key: 'extraConfig', label: 'Extra Config', type: 'string' },
    { key: 'environment', label: 'Environment', type: 'string' },
    { key: 'isActive', label: 'Is Active', type: 'boolean' },
    { key: 'lastTestedAt', label: 'Last Tested At', type: 'date' }
  ];
  private readonly excelSheetName = 'api_provider_config';

  @Public()
  @Get('template')
  @ApiOperation({ summary: 'Download blank Excel template' })
  async downloadTemplate(@Res() res: any) {
    const buf = await this.excelService.buildTemplate(this.excelSheetName, this.excelColumns);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="api_provider_config_template.xlsx"`);
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
    res.setHeader('Content-Disposition', `attachment; filename="api_provider_config_${Date.now()}.xlsx"`);
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
