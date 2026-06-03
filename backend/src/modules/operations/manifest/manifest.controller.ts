import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, Res, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '../../../common/decorators/public.decorator';
import { ExcelService, ColumnDef  } from '../../../common/services/excel.service';
import { ManifestService } from './manifest.service';
import { CreateManifestSchema, CreateManifestDto } from './dto/create-manifest.dto';
import { UpdateManifestSchema, UpdateManifestDto } from './dto/update-manifest.dto';
import { FilterManifestSchema, FilterManifestDto } from './dto/filter-manifest.dto';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../../common/guards/tenant.guard';
import { CurrentTenant } from '../../../common/decorators/tenant.decorator';
import { CurrentUser } from '../../../common/decorators/user.decorator';

@UseGuards(JwtAuthGuard, TenantGuard)
@ApiTags('operations/manifest')
@ApiBearerAuth()
@Controller('operations/manifest')
export class ManifestController {
  constructor(private readonly service: ManifestService,
    private readonly excelService: ExcelService) {}

  @Post()
  create(
    @CurrentTenant() tenantId: number,
    @CurrentUser('id') userId: number,
    @Body(new ZodValidationPipe(CreateManifestSchema)) dto: CreateManifestDto,
  ) {
    return this.service.create(tenantId, userId, dto);
  }

  @Get()
  findAll(
    @CurrentTenant() tenantId: number,
    @Query(new ZodValidationPipe(FilterManifestSchema)) query: FilterManifestDto,
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
    @Body(new ZodValidationPipe(UpdateManifestSchema)) dto: UpdateManifestDto,
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

  // ── State-machine transition endpoint ──
  @Post(':id/transition')
  transition(
    @CurrentTenant() tenantId: number,
    @CurrentUser('id') userId: number,
    @Param('id') id: string,
    @Body() body: { to: string; reasonId?: number; notes?: string },
  ) {
    return this.service.transition(tenantId, userId, id, body.to, body.reasonId, body.notes);
  }

  // ───────── Excel import / export ─────────
  private readonly excelColumns: ColumnDef[] = [
    { key: 'manifestNo', label: 'Manifest No', type: 'string' },
    { key: 'companyId', label: 'Company Id', type: 'number' },
    { key: 'originOfficeId', label: 'Origin Office Id', type: 'number' },
    { key: 'destinationOfficeId', label: 'Destination Office Id', type: 'number' },
    { key: 'manifestDate', label: 'Manifest Date', type: 'date' },
    { key: 'vendorId', label: 'Vendor Id', type: 'number' },
    { key: 'vehicleId', label: 'Vehicle Id', type: 'number' },
    { key: 'vehicleNo', label: 'Vehicle No', type: 'string' },
    { key: 'driverId', label: 'Driver Id', type: 'number' },
    { key: 'driverName', label: 'Driver Name', type: 'string' },
    { key: 'driverMobile', label: 'Driver Mobile', type: 'string' },
    { key: 'numLrs', label: 'Num Lrs', type: 'number' },
    { key: 'totalPackages', label: 'Total Packages', type: 'number' },
    { key: 'totalWeightKg', label: 'Total Weight Kg', type: 'number' },
    { key: 'tripId', label: 'Trip Id', type: 'number' },
    { key: 'consolidatedEwbNo', label: 'Consolidated Ewb No', type: 'string' },
    { key: 'estimatedKm', label: 'Estimated Km', type: 'number' },
    { key: 'freightCharges', label: 'Freight Charges', type: 'number' },
    { key: 'loadingCharges', label: 'Loading Charges', type: 'number' },
    { key: 'advancePaid', label: 'Advance Paid', type: 'number' },
    { key: 'manifestStatus', label: 'Manifest Status', type: 'string' },
    { key: 'dispatchedAt', label: 'Dispatched At', type: 'date' },
    { key: 'arrivedAt', label: 'Arrived At', type: 'date' },
    { key: 'meterStart', label: 'Meter Start', type: 'number' },
    { key: 'meterEnd', label: 'Meter End', type: 'number' },
    { key: 'podReceivedBy', label: 'Pod Received By', type: 'number' },
    { key: 'cancelReasonId', label: 'Cancel Reason Id', type: 'number' }
  ];
  private readonly excelSheetName = 'txn_manifest';

  @Public()
  @Get('template')
  @ApiOperation({ summary: 'Download blank Excel template' })
  async downloadTemplate(@Res() res: any) {
    const buf = await this.excelService.buildTemplate(this.excelSheetName, this.excelColumns);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="txn_manifest_template.xlsx"`);
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
    res.setHeader('Content-Disposition', `attachment; filename="txn_manifest_${Date.now()}.xlsx"`);
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
