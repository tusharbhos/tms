import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, Res, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '../../../common/decorators/public.decorator';
import { ExcelService, ColumnDef  } from '../../../common/services/excel.service';
import { CustomerService } from './customer.service';
import { CreateCustomerSchema, CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerSchema, UpdateCustomerDto } from './dto/update-customer.dto';
import { FilterCustomerSchema, FilterCustomerDto } from './dto/filter-customer.dto';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../../common/guards/tenant.guard';
import { CurrentTenant } from '../../../common/decorators/tenant.decorator';
import { CurrentUser } from '../../../common/decorators/user.decorator';

@UseGuards(JwtAuthGuard, TenantGuard)
@ApiTags('masters/customer')
@ApiBearerAuth()
@Controller('masters/customer')
export class CustomerController {
  constructor(private readonly service: CustomerService,
    private readonly excelService: ExcelService) {}

  @Post()
  create(
    @CurrentTenant() tenantId: number,
    @CurrentUser('id') userId: number,
    @Body(new ZodValidationPipe(CreateCustomerSchema)) dto: CreateCustomerDto,
  ) {
    return this.service.create(tenantId, userId, dto);
  }

  @Get()
  findAll(
    @CurrentTenant() tenantId: number,
    @Query(new ZodValidationPipe(FilterCustomerSchema)) query: FilterCustomerDto,
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
    @Body(new ZodValidationPipe(UpdateCustomerSchema)) dto: UpdateCustomerDto,
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
    { key: 'parentId', label: 'Parent Id', type: 'number' },
    { key: 'primaryServicingOfficeId', label: 'Primary Servicing Office Id', type: 'number' },
    { key: 'code', label: 'Code', type: 'string' },
    { key: 'name', label: 'Name', type: 'string' },
    { key: 'nameReg', label: 'Name Reg', type: 'string' },
    { key: 'cType', label: 'C Type', type: 'string' },
    { key: 'cSubtype', label: 'C Subtype', type: 'string' },
    { key: 'customerType', label: 'Customer Type', type: 'string' },
    { key: 'customerGroup', label: 'Customer Group', type: 'string' },
    { key: 'industryType', label: 'Industry Type', type: 'string' },
    { key: 'paymentTypes', label: 'Payment Types', type: 'string' },
    { key: 'mobile', label: 'Mobile', type: 'string' },
    { key: 'telNum', label: 'Tel Num', type: 'string' },
    { key: 'email', label: 'Email', type: 'string' },
    { key: 'billingContactPerson', label: 'Billing Contact Person', type: 'string' },
    { key: 'billingMobile', label: 'Billing Mobile', type: 'string' },
    { key: 'billingEmail', label: 'Billing Email', type: 'string' },
    { key: 'billingAddress', label: 'Billing Address', type: 'string' },
    { key: 'billingAddressReg', label: 'Billing Address Reg', type: 'string' },
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
    { key: 'panNum', label: 'Pan Num', type: 'string' },
    { key: 'gstNum', label: 'Gst Num', type: 'string' },
    { key: 'creditLimit', label: 'Credit Limit', type: 'number' },
    { key: 'paymentTerms', label: 'Payment Terms', type: 'string' },
    { key: 'billingCycle', label: 'Billing Cycle', type: 'string' },
    { key: 'accountManagerId', label: 'Account Manager Id', type: 'number' },
    { key: 'otherServicingOffices', label: 'Other Servicing Offices', type: 'string' },
    { key: 'erpEntryDate', label: 'Erp Entry Date', type: 'date' },
    { key: 'active', label: 'Active', type: 'boolean' }
  ];
  private readonly excelSheetName = 'customer';

  @Public()
  @Get('template')
  @ApiOperation({ summary: 'Download blank Excel template' })
  async downloadTemplate(@Res() res: any) {
    const buf = await this.excelService.buildTemplate(this.excelSheetName, this.excelColumns);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="customer_template.xlsx"`);
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
    res.setHeader('Content-Disposition', `attachment; filename="customer_${Date.now()}.xlsx"`);
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
