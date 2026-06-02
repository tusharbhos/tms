import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, Res, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '../../../common/decorators/public.decorator';
import { ExcelService, ColumnDef  } from '../../../common/services/excel.service';
import { PrnLrsService } from './prn-lrs.service';
import { CreatePrnLrsSchema, CreatePrnLrsDto } from './dto/create-prn-lrs.dto';
import { UpdatePrnLrsSchema, UpdatePrnLrsDto } from './dto/update-prn-lrs.dto';
import { FilterPrnLrsSchema, FilterPrnLrsDto } from './dto/filter-prn-lrs.dto';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../../common/guards/tenant.guard';
import { CurrentTenant } from '../../../common/decorators/tenant.decorator';
import { CurrentUser } from '../../../common/decorators/user.decorator';

@UseGuards(JwtAuthGuard, TenantGuard)
@ApiTags('operations/prn-lrs')
@ApiBearerAuth()
@Controller('operations/prn-lrs')
export class PrnLrsController {
  constructor(private readonly service: PrnLrsService,
    private readonly excelService: ExcelService) {}

  @Post()
  create(
    @CurrentTenant() tenantId: number,
    @CurrentUser('id') userId: number,
    @Body(new ZodValidationPipe(CreatePrnLrsSchema)) dto: CreatePrnLrsDto,
  ) {
    return this.service.create(tenantId, userId, dto);
  }

  @Get()
  findAll(
    @CurrentTenant() tenantId: number,
    @Query(new ZodValidationPipe(FilterPrnLrsSchema)) query: FilterPrnLrsDto,
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
    @Body(new ZodValidationPipe(UpdatePrnLrsSchema)) dto: UpdatePrnLrsDto,
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
    { key: 'prnId', label: 'Prn Id', type: 'number' },
    { key: 'lrId', label: 'Lr Id', type: 'number' },
    { key: 'bookingId', label: 'Booking Id', type: 'number' },
    { key: 'seqNo', label: 'Seq No', type: 'number' },
    { key: 'pickupAddress', label: 'Pickup Address', type: 'string' },
    { key: 'pickupLat', label: 'Pickup Lat', type: 'number' },
    { key: 'pickupLng', label: 'Pickup Lng', type: 'number' },
    { key: 'numPackages', label: 'Num Packages', type: 'number' },
    { key: 'pickupStatus', label: 'Pickup Status', type: 'string' },
    { key: 'actualPackages', label: 'Actual Packages', type: 'number' },
    { key: 'pickupTime', label: 'Pickup Time', type: 'date' },
    { key: 'pickupLatActual', label: 'Pickup Lat Actual', type: 'number' },
    { key: 'pickupLngActual', label: 'Pickup Lng Actual', type: 'number' },
    { key: 'pickupPhotoUrl', label: 'Pickup Photo Url', type: 'string' },
    { key: 'failReason', label: 'Fail Reason', type: 'string' }
  ];
  private readonly excelSheetName = 'txn_prn_lrs';

  @Public()
  @Get('template')
  @ApiOperation({ summary: 'Download blank Excel template' })
  async downloadTemplate(@Res() res: any) {
    const buf = await this.excelService.buildTemplate(this.excelSheetName, this.excelColumns);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="txn_prn_lrs_template.xlsx"`);
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
    res.setHeader('Content-Disposition', `attachment; filename="txn_prn_lrs_${Date.now()}.xlsx"`);
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
