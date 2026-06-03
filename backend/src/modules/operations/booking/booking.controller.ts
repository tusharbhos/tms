import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, Res, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '../../../common/decorators/public.decorator';
import { ExcelService, ColumnDef  } from '../../../common/services/excel.service';
import { BookingService } from './booking.service';
import { CreateBookingSchema, CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingSchema, UpdateBookingDto } from './dto/update-booking.dto';
import { FilterBookingSchema, FilterBookingDto } from './dto/filter-booking.dto';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../../common/guards/tenant.guard';
import { CurrentTenant } from '../../../common/decorators/tenant.decorator';
import { CurrentUser } from '../../../common/decorators/user.decorator';

@UseGuards(JwtAuthGuard, TenantGuard)
@ApiTags('operations/booking')
@ApiBearerAuth()
@Controller('operations/booking')
export class BookingController {
  constructor(private readonly service: BookingService,
    private readonly excelService: ExcelService) {}

  @Post()
  create(
    @CurrentTenant() tenantId: number,
    @CurrentUser('id') userId: number,
    @Body(new ZodValidationPipe(CreateBookingSchema)) dto: CreateBookingDto,
  ) {
    return this.service.create(tenantId, userId, dto);
  }

  @Get()
  findAll(
    @CurrentTenant() tenantId: number,
    @Query(new ZodValidationPipe(FilterBookingSchema)) query: FilterBookingDto,
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
    @Body(new ZodValidationPipe(UpdateBookingSchema)) dto: UpdateBookingDto,
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
    { key: 'bookingNo', label: 'Booking No', type: 'string' },
    { key: 'companyId', label: 'Company Id', type: 'number' },
    { key: 'bookingOfficeId', label: 'Booking Office Id', type: 'number' },
    { key: 'customerId', label: 'Customer Id', type: 'number' },
    { key: 'consignorId', label: 'Consignor Id', type: 'number' },
    { key: 'consigneeId', label: 'Consignee Id', type: 'number' },
    { key: 'billingPartyId', label: 'Billing Party Id', type: 'number' },
    { key: 'contractId', label: 'Contract Id', type: 'number' },
    { key: 'pickupAddressId', label: 'Pickup Address Id', type: 'number' },
    { key: 'deliveryAddressId', label: 'Delivery Address Id', type: 'number' },
    { key: 'originHubId', label: 'Origin Hub Id', type: 'number' },
    { key: 'destinationHubId', label: 'Destination Hub Id', type: 'number' },
    { key: 'originPincode', label: 'Origin Pincode', type: 'string' },
    { key: 'destinationPincode', label: 'Destination Pincode', type: 'string' },
    { key: 'isOda', label: 'Is Oda', type: 'boolean' },
    { key: 'paymentType', label: 'Payment Type', type: 'string' },
    { key: 'pickupType', label: 'Pickup Type', type: 'string' },
    { key: 'deliveryType', label: 'Delivery Type', type: 'string' },
    { key: 'loadType', label: 'Load Type', type: 'string' },
    { key: 'deliverySpeed', label: 'Delivery Speed', type: 'string' },
    { key: 'priority', label: 'Priority', type: 'string' },
    { key: 'bookingDate', label: 'Booking Date', type: 'date' },
    { key: 'expectedPickupAt', label: 'Expected Pickup At', type: 'date' },
    { key: 'expectedDeliveryAt', label: 'Expected Delivery At', type: 'date' },
    { key: 'specialInstructions', label: 'Special Instructions', type: 'string' },
    { key: 'bookingStatus', label: 'Booking Status', type: 'string' },
    { key: 'cancelReasonId', label: 'Cancel Reason Id', type: 'number' },
    { key: 'cancelNotes', label: 'Cancel Notes', type: 'string' },
    { key: 'refNum', label: 'Ref Num', type: 'string' },
    { key: 'ewaybillRequired', label: 'Ewaybill Required', type: 'boolean' },
    { key: 'bookingFlowType', label: 'Booking Flow Type', type: 'string' },
    { key: 'bookingSource', label: 'Booking Source', type: 'string' },
    { key: 'isDirectLr', label: 'Is Direct Lr', type: 'boolean' },
    { key: 'actualPickupAt', label: 'Actual Pickup At', type: 'date' },
    { key: 'verifiedBy', label: 'Verified By', type: 'number' },
    { key: 'actualWeightVerifiedAt', label: 'Actual Weight Verified At', type: 'date' }
  ];
  private readonly excelSheetName = 'txn_booking';

  @Public()
  @Get('template')
  @ApiOperation({ summary: 'Download blank Excel template' })
  async downloadTemplate(@Res() res: any) {
    const buf = await this.excelService.buildTemplate(this.excelSheetName, this.excelColumns);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="txn_booking_template.xlsx"`);
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
    res.setHeader('Content-Disposition', `attachment; filename="txn_booking_${Date.now()}.xlsx"`);
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
