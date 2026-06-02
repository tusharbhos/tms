import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, Res, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '../../../common/decorators/public.decorator';
import { ExcelService, ColumnDef  } from '../../../common/services/excel.service';
import { BookingItemsService } from './booking-items.service';
import { CreateBookingItemsSchema, CreateBookingItemsDto } from './dto/create-booking-items.dto';
import { UpdateBookingItemsSchema, UpdateBookingItemsDto } from './dto/update-booking-items.dto';
import { FilterBookingItemsSchema, FilterBookingItemsDto } from './dto/filter-booking-items.dto';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../../common/guards/tenant.guard';
import { CurrentTenant } from '../../../common/decorators/tenant.decorator';
import { CurrentUser } from '../../../common/decorators/user.decorator';

@UseGuards(JwtAuthGuard, TenantGuard)
@ApiTags('operations/booking-items')
@ApiBearerAuth()
@Controller('operations/booking-items')
export class BookingItemsController {
  constructor(private readonly service: BookingItemsService,
    private readonly excelService: ExcelService) {}

  @Post()
  create(
    @CurrentTenant() tenantId: number,
    @CurrentUser('id') userId: number,
    @Body(new ZodValidationPipe(CreateBookingItemsSchema)) dto: CreateBookingItemsDto,
  ) {
    return this.service.create(tenantId, userId, dto);
  }

  @Get()
  findAll(
    @CurrentTenant() tenantId: number,
    @Query(new ZodValidationPipe(FilterBookingItemsSchema)) query: FilterBookingItemsDto,
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
    @Body(new ZodValidationPipe(UpdateBookingItemsSchema)) dto: UpdateBookingItemsDto,
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
    { key: 'bookingId', label: 'Booking Id', type: 'number' },
    { key: 'lrId', label: 'Lr Id', type: 'number' },
    { key: 'itemSeq', label: 'Item Seq', type: 'number' },
    { key: 'invoiceNo', label: 'Invoice No', type: 'string' },
    { key: 'invoiceDate', label: 'Invoice Date', type: 'date' },
    { key: 'invoiceValue', label: 'Invoice Value', type: 'number' },
    { key: 'goodsDesc', label: 'Goods Desc', type: 'string' },
    { key: 'hsnCode', label: 'Hsn Code', type: 'string' },
    { key: 'numPackages', label: 'Num Packages', type: 'number' },
    { key: 'pkgType', label: 'Pkg Type', type: 'string' },
    { key: 'actualWeight', label: 'Actual Weight', type: 'number' },
    { key: 'lengthCm', label: 'Length Cm', type: 'number' },
    { key: 'widthCm', label: 'Width Cm', type: 'number' },
    { key: 'heightCm', label: 'Height Cm', type: 'number' },
    { key: 'volWeightKg', label: 'Vol Weight Kg', type: 'number' },
    { key: 'isDangerous', label: 'Is Dangerous', type: 'boolean' },
    { key: 'barcodeNo', label: 'Barcode No', type: 'string' },
    { key: 'pickedQty', label: 'Picked Qty', type: 'number' },
    { key: 'verifiedQty', label: 'Verified Qty', type: 'number' },
    { key: 'loadedQty', label: 'Loaded Qty', type: 'number' },
    { key: 'receivedQty', label: 'Received Qty', type: 'number' },
    { key: 'deliveredQty', label: 'Delivered Qty', type: 'number' }
  ];
  private readonly excelSheetName = 'txn_booking_items';

  @Public()
  @Get('template')
  @ApiOperation({ summary: 'Download blank Excel template' })
  async downloadTemplate(@Res() res: any) {
    const buf = await this.excelService.buildTemplate(this.excelSheetName, this.excelColumns);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="txn_booking_items_template.xlsx"`);
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
    res.setHeader('Content-Disposition', `attachment; filename="txn_booking_items_${Date.now()}.xlsx"`);
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
