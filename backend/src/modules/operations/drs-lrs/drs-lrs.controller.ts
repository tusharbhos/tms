import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, Res, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '../../../common/decorators/public.decorator';
import { ExcelService, ColumnDef  } from '../../../common/services/excel.service';
import { DrsLrsService } from './drs-lrs.service';
import { CreateDrsLrsSchema, CreateDrsLrsDto } from './dto/create-drs-lrs.dto';
import { UpdateDrsLrsSchema, UpdateDrsLrsDto } from './dto/update-drs-lrs.dto';
import { FilterDrsLrsSchema, FilterDrsLrsDto } from './dto/filter-drs-lrs.dto';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../../common/guards/tenant.guard';
import { CurrentTenant } from '../../../common/decorators/tenant.decorator';
import { CurrentUser } from '../../../common/decorators/user.decorator';

@UseGuards(JwtAuthGuard, TenantGuard)
@ApiTags('operations/drs-lrs')
@ApiBearerAuth()
@Controller('operations/drs-lrs')
export class DrsLrsController {
  constructor(private readonly service: DrsLrsService,
    private readonly excelService: ExcelService) {}

  @Post()
  create(
    @CurrentTenant() tenantId: number,
    @CurrentUser('id') userId: number,
    @Body(new ZodValidationPipe(CreateDrsLrsSchema)) dto: CreateDrsLrsDto,
  ) {
    return this.service.create(tenantId, userId, dto);
  }

  @Get()
  findAll(
    @CurrentTenant() tenantId: number,
    @Query(new ZodValidationPipe(FilterDrsLrsSchema)) query: FilterDrsLrsDto,
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
    @Body(new ZodValidationPipe(UpdateDrsLrsSchema)) dto: UpdateDrsLrsDto,
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
    { key: 'drsId', label: 'Drs Id', type: 'number' },
    { key: 'lrId', label: 'Lr Id', type: 'number' },
    { key: 'tripLrId', label: 'Trip Lr Id', type: 'number' },
    { key: 'seqNo', label: 'Seq No', type: 'number' },
    { key: 'consigneeName', label: 'Consignee Name', type: 'string' },
    { key: 'consigneeMobile', label: 'Consignee Mobile', type: 'string' },
    { key: 'deliveryAddr', label: 'Delivery Addr', type: 'string' },
    { key: 'numPackages', label: 'Num Packages', type: 'number' },
    { key: 'topayAmount', label: 'Topay Amount', type: 'number' },
    { key: 'codAmount', label: 'Cod Amount', type: 'number' },
    { key: 'delStatus', label: 'Del Status', type: 'string' },
    { key: 'podId', label: 'Pod Id', type: 'number' },
    { key: 'failReasonId', label: 'Fail Reason Id', type: 'number' },
    { key: 'reattemptDate', label: 'Reattempt Date', type: 'date' },
    { key: 'attemptNo', label: 'Attempt No', type: 'number' },
    { key: 'otpRequired', label: 'Otp Required', type: 'boolean' },
    { key: 'otpVerified', label: 'Otp Verified', type: 'boolean' },
    { key: 'receiverOtp', label: 'Receiver Otp', type: 'string' },
    { key: 'deliveryLatitude', label: 'Delivery Latitude', type: 'number' },
    { key: 'deliveryLongitude', label: 'Delivery Longitude', type: 'number' },
    { key: 'deliveryPhotoUrl', label: 'Delivery Photo Url', type: 'string' }
  ];
  private readonly excelSheetName = 'txn_drs_lrs';

  @Public()
  @Get('template')
  @ApiOperation({ summary: 'Download blank Excel template' })
  async downloadTemplate(@Res() res: any) {
    const buf = await this.excelService.buildTemplate(this.excelSheetName, this.excelColumns);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="txn_drs_lrs_template.xlsx"`);
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
    res.setHeader('Content-Disposition', `attachment; filename="txn_drs_lrs_${Date.now()}.xlsx"`);
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
