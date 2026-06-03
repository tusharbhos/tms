import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, Res, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '../../../common/decorators/public.decorator';
import { ExcelService, ColumnDef  } from '../../../common/services/excel.service';
import { OfficeService } from './office.service';
import { CreateOfficeSchema, CreateOfficeDto } from './dto/create-office.dto';
import { UpdateOfficeSchema, UpdateOfficeDto } from './dto/update-office.dto';
import { FilterOfficeSchema, FilterOfficeDto } from './dto/filter-office.dto';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../../common/guards/tenant.guard';
import { CurrentTenant } from '../../../common/decorators/tenant.decorator';
import { CurrentUser } from '../../../common/decorators/user.decorator';

@UseGuards(JwtAuthGuard, TenantGuard)
@ApiTags('masters/office')
@ApiBearerAuth()
@Controller('masters/office')
export class OfficeController {
  constructor(private readonly service: OfficeService,
    private readonly excelService: ExcelService) {}

  @Post()
  create(
    @CurrentTenant() tenantId: number,
    @CurrentUser('id') userId: number,
    @Body(new ZodValidationPipe(CreateOfficeSchema)) dto: CreateOfficeDto,
  ) {
    return this.service.create(tenantId, userId, dto);
  }

  @Get()
  findAll(
    @CurrentTenant() tenantId: number,
    @Query(new ZodValidationPipe(FilterOfficeSchema)) query: FilterOfficeDto,
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
    @Body(new ZodValidationPipe(UpdateOfficeSchema)) dto: UpdateOfficeDto,
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
    { key: 'companyTag', label: 'Company Tag', type: 'number' },
    { key: 'parentOfficeId', label: 'Parent Office Id', type: 'number' },
    { key: 'code', label: 'Code', type: 'string' },
    { key: 'name', label: 'Name', type: 'string' },
    { key: 'nameReg', label: 'Name Reg', type: 'string' },
    { key: 'oType', label: 'O Type', type: 'string' },
    { key: 'officeLevel', label: 'Office Level', type: 'number' },
    { key: 'gstNum', label: 'Gst Num', type: 'string' },
    { key: 'cinNum', label: 'Cin Num', type: 'string' },
    { key: 'owned', label: 'Owned', type: 'boolean' },
    { key: 'cpKycId', label: 'Cp Kyc Id', type: 'number' },
    { key: 'country', label: 'Country', type: 'string' },
    { key: 'state', label: 'State', type: 'string' },
    { key: 'district', label: 'District', type: 'string' },
    { key: 'taluka', label: 'Taluka', type: 'string' },
    { key: 'city', label: 'City', type: 'string' },
    { key: 'pincode', label: 'Pincode', type: 'string' },
    { key: 'address', label: 'Address', type: 'string' },
    { key: 'addressReg', label: 'Address Reg', type: 'string' },
    { key: 'latitude', label: 'Latitude', type: 'number' },
    { key: 'longitude', label: 'Longitude', type: 'number' },
    { key: 'geoZoneId', label: 'Geo Zone Id', type: 'number' },
    { key: 'capacityPackages', label: 'Capacity Packages', type: 'number' },
    { key: 'active', label: 'Active', type: 'boolean' },
    { key: 'description', label: 'Description', type: 'string' }
  ];
  private readonly excelSheetName = 'office';

  @Public()
  @Get('template')
  @ApiOperation({ summary: 'Download blank Excel template' })
  async downloadTemplate(@Res() res: any) {
    const buf = await this.excelService.buildTemplate(this.excelSheetName, this.excelColumns);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="office_template.xlsx"`);
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
    res.setHeader('Content-Disposition', `attachment; filename="office_${Date.now()}.xlsx"`);
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
