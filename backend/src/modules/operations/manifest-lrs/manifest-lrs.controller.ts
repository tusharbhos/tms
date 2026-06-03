import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, Res, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '../../../common/decorators/public.decorator';
import { ExcelService, ColumnDef  } from '../../../common/services/excel.service';
import { ManifestLrsService } from './manifest-lrs.service';
import { CreateManifestLrsSchema, CreateManifestLrsDto } from './dto/create-manifest-lrs.dto';
import { UpdateManifestLrsSchema, UpdateManifestLrsDto } from './dto/update-manifest-lrs.dto';
import { FilterManifestLrsSchema, FilterManifestLrsDto } from './dto/filter-manifest-lrs.dto';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../../common/guards/tenant.guard';
import { CurrentTenant } from '../../../common/decorators/tenant.decorator';
import { CurrentUser } from '../../../common/decorators/user.decorator';

@UseGuards(JwtAuthGuard, TenantGuard)
@ApiTags('operations/manifest-lrs')
@ApiBearerAuth()
@Controller('operations/manifest-lrs')
export class ManifestLrsController {
  constructor(private readonly service: ManifestLrsService,
    private readonly excelService: ExcelService) {}

  @Post()
  create(
    @CurrentTenant() tenantId: number,
    @CurrentUser('id') userId: number,
    @Body(new ZodValidationPipe(CreateManifestLrsSchema)) dto: CreateManifestLrsDto,
  ) {
    return this.service.create(tenantId, userId, dto);
  }

  @Get()
  findAll(
    @CurrentTenant() tenantId: number,
    @Query(new ZodValidationPipe(FilterManifestLrsSchema)) query: FilterManifestLrsDto,
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
    @Body(new ZodValidationPipe(UpdateManifestLrsSchema)) dto: UpdateManifestLrsDto,
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
    { key: 'manifestId', label: 'Manifest Id', type: 'number' },
    { key: 'lrId', label: 'Lr Id', type: 'number' },
    { key: 'numPackages', label: 'Num Packages', type: 'number' },
    { key: 'weightKg', label: 'Weight Kg', type: 'number' },
    { key: 'isLoaded', label: 'Is Loaded', type: 'boolean' },
    { key: 'loadedBy', label: 'Loaded By', type: 'number' },
    { key: 'loadedAt', label: 'Loaded At', type: 'date' },
    { key: 'isReceived', label: 'Is Received', type: 'boolean' },
    { key: 'receivedBy', label: 'Received By', type: 'number' },
    { key: 'receivedAt', label: 'Received At', type: 'date' },
    { key: 'shortagePkg', label: 'Shortage Pkg', type: 'number' },
    { key: 'excessPkg', label: 'Excess Pkg', type: 'number' },
    { key: 'damageFlag', label: 'Damage Flag', type: 'boolean' },
    { key: 'loadedScanTime', label: 'Loaded Scan Time', type: 'date' },
    { key: 'receivedScanTime', label: 'Received Scan Time', type: 'date' },
    { key: 'exceptionStatus', label: 'Exception Status', type: 'string' },
    { key: 'exceptionRemarks', label: 'Exception Remarks', type: 'string' }
  ];
  private readonly excelSheetName = 'txn_manifest_lrs';

  @Public()
  @Get('template')
  @ApiOperation({ summary: 'Download blank Excel template' })
  async downloadTemplate(@Res() res: any) {
    const buf = await this.excelService.buildTemplate(this.excelSheetName, this.excelColumns);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="txn_manifest_lrs_template.xlsx"`);
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
    res.setHeader('Content-Disposition', `attachment; filename="txn_manifest_lrs_${Date.now()}.xlsx"`);
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
