import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, Res, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '../../../common/decorators/public.decorator';
import { ExcelService, ColumnDef  } from '../../../common/services/excel.service';
import { VendorService } from './vendor.service';
import { CreateVendorSchema, CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorSchema, UpdateVendorDto } from './dto/update-vendor.dto';
import { FilterVendorSchema, FilterVendorDto } from './dto/filter-vendor.dto';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../../common/guards/tenant.guard';
import { CurrentTenant } from '../../../common/decorators/tenant.decorator';
import { CurrentUser } from '../../../common/decorators/user.decorator';

@UseGuards(JwtAuthGuard, TenantGuard)
@ApiTags('masters/vendor')
@ApiBearerAuth()
@Controller('masters/vendor')
export class VendorController {
  constructor(private readonly service: VendorService,
    private readonly excelService: ExcelService) {}

  @Post()
  create(
    @CurrentTenant() tenantId: number,
    @CurrentUser('id') userId: number,
    @Body(new ZodValidationPipe(CreateVendorSchema)) dto: CreateVendorDto,
  ) {
    return this.service.create(tenantId, userId, dto);
  }

  @Get()
  findAll(
    @CurrentTenant() tenantId: number,
    @Query(new ZodValidationPipe(FilterVendorSchema)) query: FilterVendorDto,
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
    @Body(new ZodValidationPipe(UpdateVendorSchema)) dto: UpdateVendorDto,
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
    { key: 'companyTag', label: 'Company Tag', type: 'number' },
    { key: 'contractingOfficeId', label: 'Contracting Office Id', type: 'number' },
    { key: 'code', label: 'Code', type: 'string' },
    { key: 'name', label: 'Name', type: 'string' },
    { key: 'nameReg', label: 'Name Reg', type: 'string' },
    { key: 'legalName', label: 'Legal Name', type: 'string' },
    { key: 'legalNameReg', label: 'Legal Name Reg', type: 'string' },
    { key: 'erpCode', label: 'Erp Code', type: 'string' },
    { key: 'vType', label: 'V Type', type: 'string' },
    { key: 'vendorCategory', label: 'Vendor Category', type: 'number' },
    { key: 'mobile', label: 'Mobile', type: 'string' },
    { key: 'email', label: 'Email', type: 'string' },
    { key: 'vendorRating', label: 'Vendor Rating', type: 'number' },
    { key: 'paymentTerms', label: 'Payment Terms', type: 'string' },
    { key: 'contractId', label: 'Contract Id', type: 'number' },
    { key: 'active', label: 'Active', type: 'boolean' },
    { key: 'blacklistedFlag', label: 'Blacklisted Flag', type: 'boolean' },
    { key: 'blacklistReason', label: 'Blacklist Reason', type: 'string' }
  ];
  private readonly excelSheetName = 'vendor';

  @Public()
  @Get('template')
  @ApiOperation({ summary: 'Download blank Excel template' })
  async downloadTemplate(@Res() res: any) {
    const buf = await this.excelService.buildTemplate(this.excelSheetName, this.excelColumns);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="vendor_template.xlsx"`);
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
    res.setHeader('Content-Disposition', `attachment; filename="vendor_${Date.now()}.xlsx"`);
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
