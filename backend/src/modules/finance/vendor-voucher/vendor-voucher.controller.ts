import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, Res, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '../../../common/decorators/public.decorator';
import { ExcelService, ColumnDef  } from '../../../common/services/excel.service';
import { VendorVoucherService } from './vendor-voucher.service';
import { CreateVendorVoucherSchema, CreateVendorVoucherDto } from './dto/create-vendor-voucher.dto';
import { UpdateVendorVoucherSchema, UpdateVendorVoucherDto } from './dto/update-vendor-voucher.dto';
import { FilterVendorVoucherSchema, FilterVendorVoucherDto } from './dto/filter-vendor-voucher.dto';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../../common/guards/tenant.guard';
import { CurrentTenant } from '../../../common/decorators/tenant.decorator';
import { CurrentUser } from '../../../common/decorators/user.decorator';

@UseGuards(JwtAuthGuard, TenantGuard)
@ApiTags('finance/vendor-voucher')
@ApiBearerAuth()
@Controller('finance/vendor-voucher')
export class VendorVoucherController {
  constructor(private readonly service: VendorVoucherService,
    private readonly excelService: ExcelService) {}

  @Post()
  create(
    @CurrentTenant() tenantId: number,
    @CurrentUser('id') userId: number,
    @Body(new ZodValidationPipe(CreateVendorVoucherSchema)) dto: CreateVendorVoucherDto,
  ) {
    return this.service.create(tenantId, userId, dto);
  }

  @Get()
  findAll(
    @CurrentTenant() tenantId: number,
    @Query(new ZodValidationPipe(FilterVendorVoucherSchema)) query: FilterVendorVoucherDto,
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
    @Body(new ZodValidationPipe(UpdateVendorVoucherSchema)) dto: UpdateVendorVoucherDto,
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
    { key: 'voucherNo', label: 'Voucher No', type: 'string' },
    { key: 'companyId', label: 'Company Id', type: 'number' },
    { key: 'vendorId', label: 'Vendor Id', type: 'number' },
    { key: 'tripId', label: 'Trip Id', type: 'number' },
    { key: 'manifestId', label: 'Manifest Id', type: 'number' },
    { key: 'voucherDate', label: 'Voucher Date', type: 'date' },
    { key: 'voucherType', label: 'Voucher Type', type: 'string' },
    { key: 'hireCharges', label: 'Hire Charges', type: 'number' },
    { key: 'advanceDeduction', label: 'Advance Deduction', type: 'number' },
    { key: 'loadingCharges', label: 'Loading Charges', type: 'number' },
    { key: 'fuelDeduction', label: 'Fuel Deduction', type: 'number' },
    { key: 'penaltyAmount', label: 'Penalty Amount', type: 'number' },
    { key: 'penaltyRemarks', label: 'Penalty Remarks', type: 'string' },
    { key: 'otherDeductions', label: 'Other Deductions', type: 'number' },
    { key: 'grossAmount', label: 'Gross Amount', type: 'number' },
    { key: 'netAmount', label: 'Net Amount', type: 'number' },
    { key: 'gstApplicable', label: 'Gst Applicable', type: 'boolean' },
    { key: 'tdsRate', label: 'Tds Rate', type: 'number' },
    { key: 'tdsAmount', label: 'Tds Amount', type: 'number' },
    { key: 'payableAmount', label: 'Payable Amount', type: 'number' },
    { key: 'paymentMode', label: 'Payment Mode', type: 'string' },
    { key: 'utrNumber', label: 'Utr Number', type: 'string' },
    { key: 'paidAt', label: 'Paid At', type: 'date' },
    { key: 'voucherStatus', label: 'Voucher Status', type: 'string' },
    { key: 'approvedBy', label: 'Approved By', type: 'number' },
    { key: 'pdfUrl', label: 'Pdf Url', type: 'string' },
    { key: 'sapSyncStatus', label: 'Sap Sync Status', type: 'string' },
    { key: 'sapDocumentNo', label: 'Sap Document No', type: 'string' },
    { key: 'sapSyncError', label: 'Sap Sync Error', type: 'string' },
    { key: 'sapSyncedAt', label: 'Sap Synced At', type: 'date' }
  ];
  private readonly excelSheetName = 'txn_vendor_voucher';

  @Public()
  @Get('template')
  @ApiOperation({ summary: 'Download blank Excel template' })
  async downloadTemplate(@Res() res: any) {
    const buf = await this.excelService.buildTemplate(this.excelSheetName, this.excelColumns);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="txn_vendor_voucher_template.xlsx"`);
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
    res.setHeader('Content-Disposition', `attachment; filename="txn_vendor_voucher_${Date.now()}.xlsx"`);
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
