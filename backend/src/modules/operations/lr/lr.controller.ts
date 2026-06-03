import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, Res, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '../../../common/decorators/public.decorator';
import { ExcelService, ColumnDef  } from '../../../common/services/excel.service';
import { LrService } from './lr.service';
import { CreateLrSchema, CreateLrDto } from './dto/create-lr.dto';
import { UpdateLrSchema, UpdateLrDto } from './dto/update-lr.dto';
import { FilterLrSchema, FilterLrDto } from './dto/filter-lr.dto';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../../common/guards/tenant.guard';
import { CurrentTenant } from '../../../common/decorators/tenant.decorator';
import { CurrentUser } from '../../../common/decorators/user.decorator';

@UseGuards(JwtAuthGuard, TenantGuard)
@ApiTags('operations/lr')
@ApiBearerAuth()
@Controller('operations/lr')
export class LrController {
  constructor(private readonly service: LrService,
    private readonly excelService: ExcelService) {}

  @Post()
  create(
    @CurrentTenant() tenantId: number,
    @CurrentUser('id') userId: number,
    @Body(new ZodValidationPipe(CreateLrSchema)) dto: CreateLrDto,
  ) {
    return this.service.create(tenantId, userId, dto);
  }

  @Get()
  findAll(
    @CurrentTenant() tenantId: number,
    @Query(new ZodValidationPipe(FilterLrSchema)) query: FilterLrDto,
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
    @Body(new ZodValidationPipe(UpdateLrSchema)) dto: UpdateLrDto,
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
    { key: 'lrNo', label: 'Lr No', type: 'string' },
    { key: 'bookingId', label: 'Booking Id', type: 'number' },
    { key: 'companyId', label: 'Company Id', type: 'number' },
    { key: 'originOfficeId', label: 'Origin Office Id', type: 'number' },
    { key: 'destinationOfficeId', label: 'Destination Office Id', type: 'number' },
    { key: 'currentOfficeId', label: 'Current Office Id', type: 'number' },
    { key: 'consignorId', label: 'Consignor Id', type: 'number' },
    { key: 'consigneeId', label: 'Consignee Id', type: 'number' },
    { key: 'consignorName', label: 'Consignor Name', type: 'string' },
    { key: 'consignorAddr', label: 'Consignor Addr', type: 'string' },
    { key: 'consignorGst', label: 'Consignor Gst', type: 'string' },
    { key: 'consigneeName', label: 'Consignee Name', type: 'string' },
    { key: 'consigneeAddr', label: 'Consignee Addr', type: 'string' },
    { key: 'consigneeGst', label: 'Consignee Gst', type: 'string' },
    { key: 'consigneeMobile', label: 'Consignee Mobile', type: 'string' },
    { key: 'totalPackages', label: 'Total Packages', type: 'number' },
    { key: 'totalWeightKg', label: 'Total Weight Kg', type: 'number' },
    { key: 'chargeableWeight', label: 'Chargeable Weight', type: 'number' },
    { key: 'totalCharges', label: 'Total Charges', type: 'number' },
    { key: 'paymentType', label: 'Payment Type', type: 'string' },
    { key: 'lrStatus', label: 'Lr Status', type: 'string' },
    { key: 'currentStatusCode', label: 'Current Status Code', type: 'string' },
    { key: 'ewaybillNo', label: 'Ewaybill No', type: 'string' },
    { key: 'ewaybillExpiry', label: 'Ewaybill Expiry', type: 'date' },
    { key: 'podRequired', label: 'Pod Required', type: 'boolean' },
    { key: 'podId', label: 'Pod Id', type: 'number' },
    { key: 'isReturnLr', label: 'Is Return Lr', type: 'boolean' },
    { key: 'originalLrId', label: 'Original Lr Id', type: 'number' },
    { key: 'printedAt', label: 'Printed At', type: 'date' },
    { key: 'printedBy', label: 'Printed By', type: 'number' },
    { key: 'lrSource', label: 'Lr Source', type: 'string' }
  ];
  private readonly excelSheetName = 'txn_lr';

  @Public()
  @Get('template')
  @ApiOperation({ summary: 'Download blank Excel template' })
  async downloadTemplate(@Res() res: any) {
    const buf = await this.excelService.buildTemplate(this.excelSheetName, this.excelColumns);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="txn_lr_template.xlsx"`);
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
    res.setHeader('Content-Disposition', `attachment; filename="txn_lr_${Date.now()}.xlsx"`);
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
