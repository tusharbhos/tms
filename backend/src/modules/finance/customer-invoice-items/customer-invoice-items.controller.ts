import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, Res, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '../../../common/decorators/public.decorator';
import { ExcelService, ColumnDef  } from '../../../common/services/excel.service';
import { CustomerInvoiceItemsService } from './customer-invoice-items.service';
import { CreateCustomerInvoiceItemsSchema, CreateCustomerInvoiceItemsDto } from './dto/create-customer-invoice-items.dto';
import { UpdateCustomerInvoiceItemsSchema, UpdateCustomerInvoiceItemsDto } from './dto/update-customer-invoice-items.dto';
import { FilterCustomerInvoiceItemsSchema, FilterCustomerInvoiceItemsDto } from './dto/filter-customer-invoice-items.dto';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../../common/guards/tenant.guard';
import { CurrentTenant } from '../../../common/decorators/tenant.decorator';
import { CurrentUser } from '../../../common/decorators/user.decorator';

@UseGuards(JwtAuthGuard, TenantGuard)
@ApiTags('finance/customer-invoice-items')
@ApiBearerAuth()
@Controller('finance/customer-invoice-items')
export class CustomerInvoiceItemsController {
  constructor(private readonly service: CustomerInvoiceItemsService,
    private readonly excelService: ExcelService) {}

  @Post()
  create(
    @CurrentTenant() tenantId: number,
    @CurrentUser('id') userId: number,
    @Body(new ZodValidationPipe(CreateCustomerInvoiceItemsSchema)) dto: CreateCustomerInvoiceItemsDto,
  ) {
    return this.service.create(tenantId, userId, dto);
  }

  @Get()
  findAll(
    @CurrentTenant() tenantId: number,
    @Query(new ZodValidationPipe(FilterCustomerInvoiceItemsSchema)) query: FilterCustomerInvoiceItemsDto,
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
    @Body(new ZodValidationPipe(UpdateCustomerInvoiceItemsSchema)) dto: UpdateCustomerInvoiceItemsDto,
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
    { key: 'invoiceId', label: 'Invoice Id', type: 'number' },
    { key: 'lrId', label: 'Lr Id', type: 'number' },
    { key: 'podId', label: 'Pod Id', type: 'number' },
    { key: 'lrNo', label: 'Lr No', type: 'string' },
    { key: 'lrDate', label: 'Lr Date', type: 'date' },
    { key: 'fromPlace', label: 'From Place', type: 'string' },
    { key: 'toPlace', label: 'To Place', type: 'string' },
    { key: 'numPackages', label: 'Num Packages', type: 'number' },
    { key: 'weightKg', label: 'Weight Kg', type: 'number' },
    { key: 'freightCharges', label: 'Freight Charges', type: 'number' },
    { key: 'otherCharges', label: 'Other Charges', type: 'number' },
    { key: 'totalCharges', label: 'Total Charges', type: 'number' },
    { key: 'sgstRate', label: 'Sgst Rate', type: 'number' },
    { key: 'cgstRate', label: 'Cgst Rate', type: 'number' },
    { key: 'igstRate', label: 'Igst Rate', type: 'number' },
    { key: 'sgstAmount', label: 'Sgst Amount', type: 'number' },
    { key: 'cgstAmount', label: 'Cgst Amount', type: 'number' },
    { key: 'igstAmount', label: 'Igst Amount', type: 'number' },
    { key: 'lineTotal', label: 'Line Total', type: 'number' }
  ];
  private readonly excelSheetName = 'txn_customer_invoice_items';

  @Public()
  @Get('template')
  @ApiOperation({ summary: 'Download blank Excel template' })
  async downloadTemplate(@Res() res: any) {
    const buf = await this.excelService.buildTemplate(this.excelSheetName, this.excelColumns);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="txn_customer_invoice_items_template.xlsx"`);
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
    res.setHeader('Content-Disposition', `attachment; filename="txn_customer_invoice_items_${Date.now()}.xlsx"`);
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
