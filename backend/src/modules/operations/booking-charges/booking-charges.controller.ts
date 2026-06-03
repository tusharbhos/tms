import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, Res, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '../../../common/decorators/public.decorator';
import { ExcelService, ColumnDef  } from '../../../common/services/excel.service';
import { BookingChargesService } from './booking-charges.service';
import { CreateBookingChargesSchema, CreateBookingChargesDto } from './dto/create-booking-charges.dto';
import { UpdateBookingChargesSchema, UpdateBookingChargesDto } from './dto/update-booking-charges.dto';
import { FilterBookingChargesSchema, FilterBookingChargesDto } from './dto/filter-booking-charges.dto';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../../common/guards/tenant.guard';
import { CurrentTenant } from '../../../common/decorators/tenant.decorator';
import { CurrentUser } from '../../../common/decorators/user.decorator';

@UseGuards(JwtAuthGuard, TenantGuard)
@ApiTags('operations/booking-charges')
@ApiBearerAuth()
@Controller('operations/booking-charges')
export class BookingChargesController {
  constructor(private readonly service: BookingChargesService,
    private readonly excelService: ExcelService) {}

  @Post()
  create(
    @CurrentTenant() tenantId: number,
    @CurrentUser('id') userId: number,
    @Body(new ZodValidationPipe(CreateBookingChargesSchema)) dto: CreateBookingChargesDto,
  ) {
    return this.service.create(tenantId, userId, dto);
  }

  @Get()
  findAll(
    @CurrentTenant() tenantId: number,
    @Query(new ZodValidationPipe(FilterBookingChargesSchema)) query: FilterBookingChargesDto,
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
    @Body(new ZodValidationPipe(UpdateBookingChargesSchema)) dto: UpdateBookingChargesDto,
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
    { key: 'bookingId', label: 'Booking Id', type: 'number' },
    { key: 'lrId', label: 'Lr Id', type: 'number' },
    { key: 'contractId', label: 'Contract Id', type: 'number' },
    { key: 'rateType', label: 'Rate Type', type: 'string' },
    { key: 'freightRatePerKg', label: 'Freight Rate Per Kg', type: 'number' },
    { key: 'freightRatePerPkg', label: 'Freight Rate Per Pkg', type: 'number' },
    { key: 'chargeableWeight', label: 'Chargeable Weight', type: 'number' },
    { key: 'freightCharges', label: 'Freight Charges', type: 'number' },
    { key: 'excessWeightCharges', label: 'Excess Weight Charges', type: 'number' },
    { key: 'loadingCharges', label: 'Loading Charges', type: 'number' },
    { key: 'doorDeliveryCharges', label: 'Door Delivery Charges', type: 'number' },
    { key: 'odaCharges', label: 'Oda Charges', type: 'number' },
    { key: 'insuranceRatePct', label: 'Insurance Rate Pct', type: 'number' },
    { key: 'insuranceAmount', label: 'Insurance Amount', type: 'number' },
    { key: 'fuelSurcharge', label: 'Fuel Surcharge', type: 'number' },
    { key: 'codCharges', label: 'Cod Charges', type: 'number' },
    { key: 'otherCharges', label: 'Other Charges', type: 'number' },
    { key: 'otherChargesRemarks', label: 'Other Charges Remarks', type: 'string' },
    { key: 'subTotal', label: 'Sub Total', type: 'number' },
    { key: 'sgstRate', label: 'Sgst Rate', type: 'number' },
    { key: 'cgstRate', label: 'Cgst Rate', type: 'number' },
    { key: 'igstRate', label: 'Igst Rate', type: 'number' },
    { key: 'sgstAmount', label: 'Sgst Amount', type: 'number' },
    { key: 'cgstAmount', label: 'Cgst Amount', type: 'number' },
    { key: 'igstAmount', label: 'Igst Amount', type: 'number' },
    { key: 'totalCharges', label: 'Total Charges', type: 'number' },
    { key: 'advanceAmount', label: 'Advance Amount', type: 'number' },
    { key: 'balanceAmount', label: 'Balance Amount', type: 'number' },
    { key: 'isLocked', label: 'Is Locked', type: 'boolean' }
  ];
  private readonly excelSheetName = 'txn_booking_charges';

  @Public()
  @Get('template')
  @ApiOperation({ summary: 'Download blank Excel template' })
  async downloadTemplate(@Res() res: any) {
    const buf = await this.excelService.buildTemplate(this.excelSheetName, this.excelColumns);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="txn_booking_charges_template.xlsx"`);
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
    res.setHeader('Content-Disposition', `attachment; filename="txn_booking_charges_${Date.now()}.xlsx"`);
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
