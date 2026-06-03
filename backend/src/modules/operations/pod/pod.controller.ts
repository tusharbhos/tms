import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, Res, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '../../../common/decorators/public.decorator';
import { ExcelService, ColumnDef  } from '../../../common/services/excel.service';
import { PodService } from './pod.service';
import { CreatePodSchema, CreatePodDto } from './dto/create-pod.dto';
import { UpdatePodSchema, UpdatePodDto } from './dto/update-pod.dto';
import { FilterPodSchema, FilterPodDto } from './dto/filter-pod.dto';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../../common/guards/tenant.guard';
import { CurrentTenant } from '../../../common/decorators/tenant.decorator';
import { CurrentUser } from '../../../common/decorators/user.decorator';

@UseGuards(JwtAuthGuard, TenantGuard)
@ApiTags('operations/pod')
@ApiBearerAuth()
@Controller('operations/pod')
export class PodController {
  constructor(private readonly service: PodService,
    private readonly excelService: ExcelService) {}

  @Post()
  create(
    @CurrentTenant() tenantId: number,
    @CurrentUser('id') userId: number,
    @Body(new ZodValidationPipe(CreatePodSchema)) dto: CreatePodDto,
  ) {
    return this.service.create(tenantId, userId, dto);
  }

  @Get()
  findAll(
    @CurrentTenant() tenantId: number,
    @Query(new ZodValidationPipe(FilterPodSchema)) query: FilterPodDto,
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
    @Body(new ZodValidationPipe(UpdatePodSchema)) dto: UpdatePodDto,
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
    { key: 'lrId', label: 'Lr Id', type: 'number' },
    { key: 'drsId', label: 'Drs Id', type: 'number' },
    { key: 'drsLrId', label: 'Drs Lr Id', type: 'number' },
    { key: 'podType', label: 'Pod Type', type: 'string' },
    { key: 'receiverName', label: 'Receiver Name', type: 'string' },
    { key: 'receiverMobile', label: 'Receiver Mobile', type: 'string' },
    { key: 'receiverRelation', label: 'Receiver Relation', type: 'string' },
    { key: 'signatureUrl', label: 'Signature Url', type: 'string' },
    { key: 'photoUrl', label: 'Photo Url', type: 'string' },
    { key: 'stampUrl', label: 'Stamp Url', type: 'string' },
    { key: 'geoLatitude', label: 'Geo Latitude', type: 'number' },
    { key: 'geoLongitude', label: 'Geo Longitude', type: 'number' },
    { key: 'deliveryTime', label: 'Delivery Time', type: 'date' },
    { key: 'numPackagesDel', label: 'Num Packages Del', type: 'number' },
    { key: 'damageStatus', label: 'Damage Status', type: 'string' },
    { key: 'shortageQty', label: 'Shortage Qty', type: 'number' },
    { key: 'excessQty', label: 'Excess Qty', type: 'number' },
    { key: 'remarks', label: 'Remarks', type: 'string' },
    { key: 'topayCollected', label: 'Topay Collected', type: 'number' },
    { key: 'codCollected', label: 'Cod Collected', type: 'number' },
    { key: 'verified', label: 'Verified', type: 'boolean' },
    { key: 'verifiedBy', label: 'Verified By', type: 'number' },
    { key: 'verifiedAt', label: 'Verified At', type: 'date' },
    { key: 'invoiceTriggered', label: 'Invoice Triggered', type: 'boolean' },
    { key: 'otpVerified', label: 'Otp Verified', type: 'boolean' },
    { key: 'podVerificationStatus', label: 'Pod Verification Status', type: 'string' },
    { key: 'podRejectReasonId', label: 'Pod Reject Reason Id', type: 'number' }
  ];
  private readonly excelSheetName = 'txn_pod';

  @Public()
  @Get('template')
  @ApiOperation({ summary: 'Download blank Excel template' })
  async downloadTemplate(@Res() res: any) {
    const buf = await this.excelService.buildTemplate(this.excelSheetName, this.excelColumns);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="txn_pod_template.xlsx"`);
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
    res.setHeader('Content-Disposition', `attachment; filename="txn_pod_${Date.now()}.xlsx"`);
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
