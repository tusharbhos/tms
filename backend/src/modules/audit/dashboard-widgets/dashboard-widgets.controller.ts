import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, Res, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '../../../common/decorators/public.decorator';
import { ExcelService, ColumnDef  } from '../../../common/services/excel.service';
import { DashboardWidgetsService } from './dashboard-widgets.service';
import { CreateDashboardWidgetsSchema, CreateDashboardWidgetsDto } from './dto/create-dashboard-widgets.dto';
import { UpdateDashboardWidgetsSchema, UpdateDashboardWidgetsDto } from './dto/update-dashboard-widgets.dto';
import { FilterDashboardWidgetsSchema, FilterDashboardWidgetsDto } from './dto/filter-dashboard-widgets.dto';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../../common/guards/tenant.guard';
import { CurrentTenant } from '../../../common/decorators/tenant.decorator';
import { CurrentUser } from '../../../common/decorators/user.decorator';

@UseGuards(JwtAuthGuard, TenantGuard)
@ApiTags('audit/dashboard-widgets')
@ApiBearerAuth()
@Controller('audit/dashboard-widgets')
export class DashboardWidgetsController {
  constructor(private readonly service: DashboardWidgetsService,
    private readonly excelService: ExcelService) {}

  @Post()
  create(
    @CurrentTenant() tenantId: number,
    @CurrentUser('id') userId: number,
    @Body(new ZodValidationPipe(CreateDashboardWidgetsSchema)) dto: CreateDashboardWidgetsDto,
  ) {
    return this.service.create(tenantId, userId, dto);
  }

  @Get()
  findAll(
    @CurrentTenant() tenantId: number,
    @Query(new ZodValidationPipe(FilterDashboardWidgetsSchema)) query: FilterDashboardWidgetsDto,
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
    @Body(new ZodValidationPipe(UpdateDashboardWidgetsSchema)) dto: UpdateDashboardWidgetsDto,
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
    { key: 'dashboardId', label: 'Dashboard Id', type: 'number' },
    { key: 'widgetKey', label: 'Widget Key', type: 'string' },
    { key: 'widgetName', label: 'Widget Name', type: 'string' },
    { key: 'widgetType', label: 'Widget Type', type: 'string' },
    { key: 'dataSource', label: 'Data Source', type: 'string' },
    { key: 'refreshSeconds', label: 'Refresh Seconds', type: 'number' },
    { key: 'positionX', label: 'Position X', type: 'number' },
    { key: 'positionY', label: 'Position Y', type: 'number' },
    { key: 'width', label: 'Width', type: 'number' },
    { key: 'height', label: 'Height', type: 'number' },
    { key: 'config', label: 'Config', type: 'string' },
    { key: 'sortOrder', label: 'Sort Order', type: 'number' },
    { key: 'isVisible', label: 'Is Visible', type: 'boolean' },
    { key: 'featureFlagKey', label: 'Feature Flag Key', type: 'string' }
  ];
  private readonly excelSheetName = 'dashboard_widgets';

  @Public()
  @Get('template')
  @ApiOperation({ summary: 'Download blank Excel template' })
  async downloadTemplate(@Res() res: any) {
    const buf = await this.excelService.buildTemplate(this.excelSheetName, this.excelColumns);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="dashboard_widgets_template.xlsx"`);
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
    res.setHeader('Content-Disposition', `attachment; filename="dashboard_widgets_${Date.now()}.xlsx"`);
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
