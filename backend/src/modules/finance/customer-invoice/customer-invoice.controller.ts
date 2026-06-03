import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, Res, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '../../../common/decorators/public.decorator';
import { ExcelService, ColumnDef  } from '../../../common/services/excel.service';
import { CustomerInvoiceService } from './customer-invoice.service';
import { CreateCustomerInvoiceSchema, CreateCustomerInvoiceDto } from './dto/create-customer-invoice.dto';
import { UpdateCustomerInvoiceSchema, UpdateCustomerInvoiceDto } from './dto/update-customer-invoice.dto';
import { FilterCustomerInvoiceSchema, FilterCustomerInvoiceDto } from './dto/filter-customer-invoice.dto';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../../common/guards/tenant.guard';
import { CurrentTenant } from '../../../common/decorators/tenant.decorator';
import { CurrentUser } from '../../../common/decorators/user.decorator';

@UseGuards(JwtAuthGuard, TenantGuard)
@ApiTags('finance/customer-invoice')
@ApiBearerAuth()
@Controller('finance/customer-invoice')
export class CustomerInvoiceController {
  constructor(private readonly service: CustomerInvoiceService,
    private readonly excelService: ExcelService) {}

  @Post()
  create(
    @CurrentTenant() tenantId: number,
    @CurrentUser('id') userId: number,
    @Body(new ZodValidationPipe(CreateCustomerInvoiceSchema)) dto: CreateCustomerInvoiceDto,
  ) {
    return this.service.create(tenantId, userId, dto);
  }

  @Get()
  findAll(
    @CurrentTenant() tenantId: number,
    @Query(new ZodValidationPipe(FilterCustomerInvoiceSchema)) query: FilterCustomerInvoiceDto,
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
    @Body(new ZodValidationPipe(UpdateCustomerInvoiceSchema)) dto: UpdateCustomerInvoiceDto,
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
    { key: 'invoiceNo', label: 'Invoice No', type: 'string' },
    { key: 'companyId', label: 'Company Id', type: 'number' },
    { key: 'billingOfficeId', label: 'Billing Office Id', type: 'number' },
    { key: 'customerId', label: 'Customer Id', type: 'number' },
    { key: 'invoiceType', label: 'Invoice Type', type: 'string' },
    { key: 'invoiceDate', label: 'Invoice Date', type: 'date' },
    { key: 'dueDate', label: 'Due Date', type: 'date' },
    { key: 'periodFrom', label: 'Period From', type: 'date' },
    { key: 'periodTo', label: 'Period To', type: 'date' },
    { key: 'numLrs', label: 'Num Lrs', type: 'number' },
    { key: 'subTotal', label: 'Sub Total', type: 'number' },
    { key: 'totalSgst', label: 'Total Sgst', type: 'number' },
    { key: 'totalCgst', label: 'Total Cgst', type: 'number' },
    { key: 'totalIgst', label: 'Total Igst', type: 'number' },
    { key: 'grandTotal', label: 'Grand Total', type: 'number' },
    { key: 'tdsRate', label: 'Tds Rate', type: 'number' },
    { key: 'tdsAmount', label: 'Tds Amount', type: 'number' },
    { key: 'invoiceStatus', label: 'Invoice Status', type: 'string' },
    { key: 'paymentReceived', label: 'Payment Received', type: 'number' },
    { key: 'pdfUrl', label: 'Pdf Url', type: 'string' },
    { key: 'emailSentAt', label: 'Email Sent At', type: 'date' },
    { key: 'isGstInvoice', label: 'Is Gst Invoice', type: 'boolean' },
    { key: 'referenceInvoiceId', label: 'Reference Invoice Id', type: 'number' },
    { key: 'sapSyncStatus', label: 'Sap Sync Status', type: 'string' },
    { key: 'sapDocumentNo', label: 'Sap Document No', type: 'string' },
    { key: 'sapSyncError', label: 'Sap Sync Error', type: 'string' },
    { key: 'sapSyncedAt', label: 'Sap Synced At', type: 'date' }
  ];
  private readonly excelSheetName = 'txn_customer_invoice';

  @Public()
  @Get('template')
  @ApiOperation({ summary: 'Download blank Excel template' })
  async downloadTemplate(@Res() res: any) {
    const buf = await this.excelService.buildTemplate(this.excelSheetName, this.excelColumns);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="txn_customer_invoice_template.xlsx"`);
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
    res.setHeader('Content-Disposition', `attachment; filename="txn_customer_invoice_${Date.now()}.xlsx"`);
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
