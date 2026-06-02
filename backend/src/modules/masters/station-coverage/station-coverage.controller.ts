import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, Res, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '../../../common/decorators/public.decorator';
import { ExcelService, ColumnDef  } from '../../../common/services/excel.service';
import { StationCoverageService } from './station-coverage.service';
import { CreateStationCoverageSchema, CreateStationCoverageDto } from './dto/create-station-coverage.dto';
import { UpdateStationCoverageSchema, UpdateStationCoverageDto } from './dto/update-station-coverage.dto';
import { FilterStationCoverageSchema, FilterStationCoverageDto } from './dto/filter-station-coverage.dto';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../../common/guards/tenant.guard';
import { CurrentTenant } from '../../../common/decorators/tenant.decorator';
import { CurrentUser } from '../../../common/decorators/user.decorator';

@UseGuards(JwtAuthGuard, TenantGuard)
@ApiTags('masters/station-coverage')
@ApiBearerAuth()
@Controller('masters/station-coverage')
export class StationCoverageController {
  constructor(private readonly service: StationCoverageService,
    private readonly excelService: ExcelService) {}

  @Post()
  create(
    @CurrentTenant() tenantId: number,
    @CurrentUser('id') userId: number,
    @Body(new ZodValidationPipe(CreateStationCoverageSchema)) dto: CreateStationCoverageDto,
  ) {
    return this.service.create(tenantId, userId, dto);
  }

  @Get()
  findAll(
    @CurrentTenant() tenantId: number,
    @Query(new ZodValidationPipe(FilterStationCoverageSchema)) query: FilterStationCoverageDto,
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
    @Body(new ZodValidationPipe(UpdateStationCoverageSchema)) dto: UpdateStationCoverageDto,
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
    { key: 'servicingOfficeId', label: 'Servicing Office Id', type: 'number' },
    { key: 'name', label: 'Name', type: 'string' },
    { key: 'nameReg', label: 'Name Reg', type: 'string' },
    { key: 'postName', label: 'Post Name', type: 'string' },
    { key: 'postNameReg', label: 'Post Name Reg', type: 'string' },
    { key: 'pincode', label: 'Pincode', type: 'string' },
    { key: 'taluka', label: 'Taluka', type: 'string' },
    { key: 'talukaReg', label: 'Taluka Reg', type: 'string' },
    { key: 'district', label: 'District', type: 'string' },
    { key: 'districtReg', label: 'District Reg', type: 'string' },
    { key: 'state', label: 'State', type: 'string' },
    { key: 'stateReg', label: 'State Reg', type: 'string' },
    { key: 'country', label: 'Country', type: 'string' },
    { key: 'latitude', label: 'Latitude', type: 'number' },
    { key: 'longitude', label: 'Longitude', type: 'number' },
    { key: 'nameGmap', label: 'Name Gmap', type: 'string' },
    { key: 'serviceOfficeTat', label: 'Service Office Tat', type: 'number' },
    { key: 'servicingOfficeDist', label: 'Servicing Office Dist', type: 'number' },
    { key: 'zone', label: 'Zone', type: 'string' },
    { key: 'routeNum', label: 'Route Num', type: 'string' },
    { key: 'routeSequence', label: 'Route Sequence', type: 'number' },
    { key: 'oda', label: 'Oda', type: 'boolean' },
    { key: 'nrStateHighway', label: 'Nr State Highway', type: 'string' },
    { key: 'nrNationalHighway', label: 'Nr National Highway', type: 'string' },
    { key: 'active', label: 'Active', type: 'boolean' },
    { key: 'status', label: 'Status', type: 'string' },
    { key: 'note', label: 'Note', type: 'string' }
  ];
  private readonly excelSheetName = 'station_coverage';

  @Public()
  @Get('template')
  @ApiOperation({ summary: 'Download blank Excel template' })
  async downloadTemplate(@Res() res: any) {
    const buf = await this.excelService.buildTemplate(this.excelSheetName, this.excelColumns);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="station_coverage_template.xlsx"`);
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
    res.setHeader('Content-Disposition', `attachment; filename="station_coverage_${Date.now()}.xlsx"`);
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
