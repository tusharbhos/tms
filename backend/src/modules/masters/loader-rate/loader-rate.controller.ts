import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, Res, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '../../../common/decorators/public.decorator';
import { ExcelService, ColumnDef  } from '../../../common/services/excel.service';
import { LoaderRateService } from './loader-rate.service';
import { CreateLoaderRateSchema, CreateLoaderRateDto } from './dto/create-loader-rate.dto';
import { UpdateLoaderRateSchema, UpdateLoaderRateDto } from './dto/update-loader-rate.dto';
import { FilterLoaderRateSchema, FilterLoaderRateDto } from './dto/filter-loader-rate.dto';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../../common/guards/tenant.guard';
import { CurrentTenant } from '../../../common/decorators/tenant.decorator';
import { CurrentUser } from '../../../common/decorators/user.decorator';

@UseGuards(JwtAuthGuard, TenantGuard)
@ApiTags('masters/loader-rate')
@ApiBearerAuth()
@Controller('masters/loader-rate')
export class LoaderRateController {
  constructor(private readonly service: LoaderRateService,
    private readonly excelService: ExcelService) {}

  @Post()
  create(
    @CurrentTenant() tenantId: number,
    @CurrentUser('id') userId: number,
    @Body(new ZodValidationPipe(CreateLoaderRateSchema)) dto: CreateLoaderRateDto,
  ) {
    return this.service.create(tenantId, userId, dto);
  }

  @Get()
  findAll(
    @CurrentTenant() tenantId: number,
    @Query(new ZodValidationPipe(FilterLoaderRateSchema)) query: FilterLoaderRateDto,
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
    @Body(new ZodValidationPipe(UpdateLoaderRateSchema)) dto: UpdateLoaderRateDto,
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
    { key: 'contractingOfficeId', label: 'Contracting Office Id', type: 'number' },
    { key: 'vendorId', label: 'Vendor Id', type: 'number' },
    { key: 'vendorName', label: 'Vendor Name', type: 'string' },
    { key: 'defaultRateType', label: 'Default Rate Type', type: 'string' },
    { key: 'regPkgRate', label: 'Reg Pkg Rate', type: 'number' },
    { key: 'crossingPkgRate', label: 'Crossing Pkg Rate', type: 'number' },
    { key: 'regWeightRate', label: 'Reg Weight Rate', type: 'number' },
    { key: 'crossingWeightRate', label: 'Crossing Weight Rate', type: 'number' },
    { key: 'monthlySal', label: 'Monthly Sal', type: 'number' },
    { key: 'dailyAllowance', label: 'Daily Allowance', type: 'number' },
    { key: 'dailyWage', label: 'Daily Wage', type: 'number' },
    { key: 'dailyWagePkgCapping', label: 'Daily Wage Pkg Capping', type: 'number' },
    { key: 'dailyWageWeightCapping', label: 'Daily Wage Weight Capping', type: 'number' },
    { key: 'overtimeHourlyRate', label: 'Overtime Hourly Rate', type: 'number' },
    { key: 'startDate', label: 'Start Date', type: 'date' },
    { key: 'endDate', label: 'End Date', type: 'date' },
    { key: 'active', label: 'Active', type: 'boolean' },
    { key: 'status', label: 'Status', type: 'string' },
    { key: 'note', label: 'Note', type: 'string' },
    { key: 'versionNo', label: 'Version No', type: 'number' },
    { key: 'isCurrent', label: 'Is Current', type: 'boolean' },
    { key: 'supersededBy', label: 'Superseded By', type: 'number' },
    { key: 'approvalStatus', label: 'Approval Status', type: 'string' },
    { key: 'approvedBy', label: 'Approved By', type: 'number' },
    { key: 'rejectionReason', label: 'Rejection Reason', type: 'string' },
    { key: 'effectiveFrom', label: 'Effective From', type: 'date' },
    { key: 'effectiveUntil', label: 'Effective Until', type: 'date' },
    { key: 'changeSummary', label: 'Change Summary', type: 'string' },
    { key: 'previousVersionId', label: 'Previous Version Id', type: 'number' }
  ];
  private readonly excelSheetName = 'loader_rate';

  @Public()
  @Get('template')
  @ApiOperation({ summary: 'Download blank Excel template' })
  async downloadTemplate(@Res() res: any) {
    const buf = await this.excelService.buildTemplate(this.excelSheetName, this.excelColumns);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="loader_rate_template.xlsx"`);
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
    res.setHeader('Content-Disposition', `attachment; filename="loader_rate_${Date.now()}.xlsx"`);
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
