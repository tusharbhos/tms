import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, Res, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '../../../common/decorators/public.decorator';
import { ExcelService, ColumnDef  } from '../../../common/services/excel.service';
import { EwaybillService } from './ewaybill.service';
import { CreateEwaybillSchema, CreateEwaybillDto } from './dto/create-ewaybill.dto';
import { UpdateEwaybillSchema, UpdateEwaybillDto } from './dto/update-ewaybill.dto';
import { FilterEwaybillSchema, FilterEwaybillDto } from './dto/filter-ewaybill.dto';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../../common/guards/tenant.guard';
import { CurrentTenant } from '../../../common/decorators/tenant.decorator';
import { CurrentUser } from '../../../common/decorators/user.decorator';

@UseGuards(JwtAuthGuard, TenantGuard)
@ApiTags('operations/ewaybill')
@ApiBearerAuth()
@Controller('operations/ewaybill')
export class EwaybillController {
  constructor(private readonly service: EwaybillService,
    private readonly excelService: ExcelService) {}

  @Post()
  create(
    @CurrentTenant() tenantId: number,
    @CurrentUser('id') userId: number,
    @Body(new ZodValidationPipe(CreateEwaybillSchema)) dto: CreateEwaybillDto,
  ) {
    return this.service.create(tenantId, userId, dto);
  }

  @Get()
  findAll(
    @CurrentTenant() tenantId: number,
    @Query(new ZodValidationPipe(FilterEwaybillSchema)) query: FilterEwaybillDto,
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
    @Body(new ZodValidationPipe(UpdateEwaybillSchema)) dto: UpdateEwaybillDto,
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
    { key: 'lrId', label: 'Lr Id', type: 'number' },
    { key: 'bookingId', label: 'Booking Id', type: 'number' },
    { key: 'ewbNo', label: 'Ewb No', type: 'string' },
    { key: 'ewbDate', label: 'Ewb Date', type: 'date' },
    { key: 'ewbValidTill', label: 'Ewb Valid Till', type: 'date' },
    { key: 'ewbType', label: 'Ewb Type', type: 'string' },
    { key: 'supplyType', label: 'Supply Type', type: 'string' },
    { key: 'gstinSupplier', label: 'Gstin Supplier', type: 'string' },
    { key: 'gstinRecipient', label: 'Gstin Recipient', type: 'string' },
    { key: 'placeOfSupply', label: 'Place Of Supply', type: 'string' },
    { key: 'totalValue', label: 'Total Value', type: 'number' },
    { key: 'hsnCode', label: 'Hsn Code', type: 'string' },
    { key: 'transporterId', label: 'Transporter Id', type: 'string' },
    { key: 'vehicleNo', label: 'Vehicle No', type: 'string' },
    { key: 'vehicleType', label: 'Vehicle Type', type: 'string' },
    { key: 'ewbStatus', label: 'Ewb Status', type: 'string' },
    { key: 'generationMode', label: 'Generation Mode', type: 'string' },
    { key: 'cancelReason', label: 'Cancel Reason', type: 'string' },
    { key: 'apiRequestJson', label: 'Api Request Json', type: 'string' },
    { key: 'apiResponseJson', label: 'Api Response Json', type: 'string' },
    { key: 'consolidatedEwbNo', label: 'Consolidated Ewb No', type: 'string' }
  ];
  private readonly excelSheetName = 'txn_ewaybill';

  @Public()
  @Get('template')
  @ApiOperation({ summary: 'Download blank Excel template' })
  async downloadTemplate(@Res() res: any) {
    const buf = await this.excelService.buildTemplate(this.excelSheetName, this.excelColumns);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="txn_ewaybill_template.xlsx"`);
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
    res.setHeader('Content-Disposition', `attachment; filename="txn_ewaybill_${Date.now()}.xlsx"`);
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
