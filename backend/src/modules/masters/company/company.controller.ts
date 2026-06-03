import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, Res, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '../../../common/decorators/public.decorator';
import { ExcelService, ColumnDef  } from '../../../common/services/excel.service';
import { CompanyService } from './company.service';
import { CreateCompanySchema, CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanySchema, UpdateCompanyDto } from './dto/update-company.dto';
import { FilterCompanySchema, FilterCompanyDto } from './dto/filter-company.dto';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../../common/guards/tenant.guard';
import { CurrentTenant } from '../../../common/decorators/tenant.decorator';
import { CurrentUser } from '../../../common/decorators/user.decorator';

@UseGuards(JwtAuthGuard, TenantGuard)
@ApiTags('masters/company')
@ApiBearerAuth()
@Controller('masters/company')
export class CompanyController {
  constructor(private readonly service: CompanyService,
    private readonly excelService: ExcelService) {}

  @Post()
  create(
    @CurrentTenant() tenantId: number,
    @CurrentUser('id') userId: number,
    @Body(new ZodValidationPipe(CreateCompanySchema)) dto: CreateCompanyDto,
  ) {
    return this.service.create(tenantId, userId, dto);
  }

  @Get()
  findAll(
    @CurrentTenant() tenantId: number,
    @Query(new ZodValidationPipe(FilterCompanySchema)) query: FilterCompanyDto,
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
    @Body(new ZodValidationPipe(UpdateCompanySchema)) dto: UpdateCompanyDto,
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
    { key: 'parentCompanyId', label: 'Parent Company Id', type: 'number' },
    { key: 'code', label: 'Code', type: 'string' },
    { key: 'name', label: 'Name', type: 'string' },
    { key: 'nameReg', label: 'Name Reg', type: 'string' },
    { key: 'phone1', label: 'Phone1', type: 'string' },
    { key: 'phone2', label: 'Phone2', type: 'string' },
    { key: 'email1', label: 'Email1', type: 'string' },
    { key: 'email2', label: 'Email2', type: 'string' },
    { key: 'website', label: 'Website', type: 'string' },
    { key: 'address', label: 'Address', type: 'string' },
    { key: 'addressReg', label: 'Address Reg', type: 'string' },
    { key: 'gstNum', label: 'Gst Num', type: 'string' },
    { key: 'cinNum', label: 'Cin Num', type: 'string' },
    { key: 'panNum', label: 'Pan Num', type: 'string' },
    { key: 'tanNum', label: 'Tan Num', type: 'string' },
    { key: 'msmeNum', label: 'Msme Num', type: 'string' },
    { key: 'logoUrl', label: 'Logo Url', type: 'string' },
    { key: 'organizationId', label: 'Organization Id', type: 'number' },
    { key: 'legalEntityType', label: 'Legal Entity Type', type: 'string' },
    { key: 'registrationNumber', label: 'Registration Number', type: 'string' },
    { key: 'active', label: 'Active', type: 'boolean' },
    { key: 'seqNum', label: 'Seq Num', type: 'number' }
  ];
  private readonly excelSheetName = 'company';

  @Public()
  @Get('template')
  @ApiOperation({ summary: 'Download blank Excel template' })
  async downloadTemplate(@Res() res: any) {
    const buf = await this.excelService.buildTemplate(this.excelSheetName, this.excelColumns);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="company_template.xlsx"`);
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
    res.setHeader('Content-Disposition', `attachment; filename="company_${Date.now()}.xlsx"`);
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
