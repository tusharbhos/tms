import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, Res, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '../../../common/decorators/public.decorator';
import { ExcelService, ColumnDef  } from '../../../common/services/excel.service';
import { CpKycService } from './cp-kyc.service';
import { CreateCpKycSchema, CreateCpKycDto } from './dto/create-cp-kyc.dto';
import { UpdateCpKycSchema, UpdateCpKycDto } from './dto/update-cp-kyc.dto';
import { FilterCpKycSchema, FilterCpKycDto } from './dto/filter-cp-kyc.dto';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../../common/guards/tenant.guard';
import { CurrentTenant } from '../../../common/decorators/tenant.decorator';
import { CurrentUser } from '../../../common/decorators/user.decorator';

@UseGuards(JwtAuthGuard, TenantGuard)
@ApiTags('masters/cp-kyc')
@ApiBearerAuth()
@Controller('masters/cp-kyc')
export class CpKycController {
  constructor(private readonly service: CpKycService,
    private readonly excelService: ExcelService) {}

  @Post()
  create(
    @CurrentTenant() tenantId: number,
    @CurrentUser('id') userId: number,
    @Body(new ZodValidationPipe(CreateCpKycSchema)) dto: CreateCpKycDto,
  ) {
    return this.service.create(tenantId, userId, dto);
  }

  @Get()
  findAll(
    @CurrentTenant() tenantId: number,
    @Query(new ZodValidationPipe(FilterCpKycSchema)) query: FilterCpKycDto,
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
    @Body(new ZodValidationPipe(UpdateCpKycSchema)) dto: UpdateCpKycDto,
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
    { key: 'cpId', label: 'Cp Id', type: 'number' },
    { key: 'legalName', label: 'Legal Name', type: 'string' },
    { key: 'dateOfReg', label: 'Date Of Reg', type: 'date' },
    { key: 'owner1Name', label: 'Owner1 Name', type: 'string' },
    { key: 'photo1Url', label: 'Photo1 Url', type: 'string' },
    { key: 'owner1Aadhaar', label: 'Owner1 Aadhaar', type: 'string' },
    { key: 'owner1AadhaarUrl', label: 'Owner1 Aadhaar Url', type: 'string' },
    { key: 'owner1Pan', label: 'Owner1 Pan', type: 'string' },
    { key: 'owner1PanUrl', label: 'Owner1 Pan Url', type: 'string' },
    { key: 'owner1Email', label: 'Owner1 Email', type: 'string' },
    { key: 'owner1Mobile', label: 'Owner1 Mobile', type: 'string' },
    { key: 'owner2Name', label: 'Owner2 Name', type: 'string' },
    { key: 'photo2Url', label: 'Photo2 Url', type: 'string' },
    { key: 'owner2Aadhaar', label: 'Owner2 Aadhaar', type: 'string' },
    { key: 'owner2AadhaarUrl', label: 'Owner2 Aadhaar Url', type: 'string' },
    { key: 'owner2Pan', label: 'Owner2 Pan', type: 'string' },
    { key: 'owner2PanUrl', label: 'Owner2 Pan Url', type: 'string' },
    { key: 'owner2Email', label: 'Owner2 Email', type: 'string' },
    { key: 'owner2Mobile', label: 'Owner2 Mobile', type: 'string' },
    { key: 'country', label: 'Country', type: 'string' },
    { key: 'state', label: 'State', type: 'string' },
    { key: 'district', label: 'District', type: 'string' },
    { key: 'taluka', label: 'Taluka', type: 'string' },
    { key: 'city', label: 'City', type: 'string' },
    { key: 'pincode', label: 'Pincode', type: 'string' },
    { key: 'address', label: 'Address', type: 'string' },
    { key: 'addressReg', label: 'Address Reg', type: 'string' },
    { key: 'addrDocUrl', label: 'Addr Doc Url', type: 'string' },
    { key: 'latitude', label: 'Latitude', type: 'number' },
    { key: 'longitude', label: 'Longitude', type: 'number' },
    { key: 'gstNum', label: 'Gst Num', type: 'string' },
    { key: 'gstCertUrl', label: 'Gst Cert Url', type: 'string' },
    { key: 'cinNum', label: 'Cin Num', type: 'string' },
    { key: 'companyRegCertUrl', label: 'Company Reg Cert Url', type: 'string' },
    { key: 'panNum', label: 'Pan Num', type: 'string' },
    { key: 'panCardUrl', label: 'Pan Card Url', type: 'string' },
    { key: 'tanNum', label: 'Tan Num', type: 'string' },
    { key: 'tanCardUrl', label: 'Tan Card Url', type: 'string' },
    { key: 'msmeNum', label: 'Msme Num', type: 'string' },
    { key: 'msmeRegCertUrl', label: 'Msme Reg Cert Url', type: 'string' },
    { key: 'aadhaarNum', label: 'Aadhaar Num', type: 'string' },
    { key: 'aadhaarCardUrl', label: 'Aadhaar Card Url', type: 'string' },
    { key: 'bank1Name', label: 'Bank1 Name', type: 'string' },
    { key: 'bank1AccntHolder', label: 'Bank1 Accnt Holder', type: 'string' },
    { key: 'bank1AccountType', label: 'Bank1 Account Type', type: 'string' },
    { key: 'bank1AccountNum', label: 'Bank1 Account Num', type: 'string' },
    { key: 'bank1IfscCode', label: 'Bank1 Ifsc Code', type: 'string' },
    { key: 'bank1DocUrl', label: 'Bank1 Doc Url', type: 'string' },
    { key: 'bank2Name', label: 'Bank2 Name', type: 'string' },
    { key: 'bank2AccntHolder', label: 'Bank2 Accnt Holder', type: 'string' },
    { key: 'bank2AccountType', label: 'Bank2 Account Type', type: 'string' },
    { key: 'bank2AccountNum', label: 'Bank2 Account Num', type: 'string' },
    { key: 'bank2IfscCode', label: 'Bank2 Ifsc Code', type: 'string' },
    { key: 'bank2DocUrl', label: 'Bank2 Doc Url', type: 'string' },
    { key: 'doc1Name', label: 'Doc1 Name', type: 'string' },
    { key: 'doc1Url', label: 'Doc1 Url', type: 'string' },
    { key: 'doc1Date', label: 'Doc1 Date', type: 'date' },
    { key: 'doc2Name', label: 'Doc2 Name', type: 'string' },
    { key: 'doc2Url', label: 'Doc2 Url', type: 'string' },
    { key: 'doc2Date', label: 'Doc2 Date', type: 'date' },
    { key: 'doc3Name', label: 'Doc3 Name', type: 'string' },
    { key: 'doc3Url', label: 'Doc3 Url', type: 'string' },
    { key: 'doc3Date', label: 'Doc3 Date', type: 'date' },
    { key: 'doc4Name', label: 'Doc4 Name', type: 'string' },
    { key: 'doc4Url', label: 'Doc4 Url', type: 'string' },
    { key: 'doc4Date', label: 'Doc4 Date', type: 'date' },
    { key: 'kycCompleted', label: 'Kyc Completed', type: 'boolean' },
    { key: 'active', label: 'Active', type: 'boolean' },
    { key: 'status', label: 'Status', type: 'string' },
    { key: 'note', label: 'Note', type: 'string' },
    { key: 'verificationStatus', label: 'Verification Status', type: 'string' },
    { key: 'verifiedBy', label: 'Verified By', type: 'number' },
    { key: 'verifiedAt', label: 'Verified At', type: 'date' },
    { key: 'expiryDate', label: 'Expiry Date', type: 'date' },
    { key: 'rejectionReason', label: 'Rejection Reason', type: 'string' }
  ];
  private readonly excelSheetName = 'cp_kyc';

  @Public()
  @Get('template')
  @ApiOperation({ summary: 'Download blank Excel template' })
  async downloadTemplate(@Res() res: any) {
    const buf = await this.excelService.buildTemplate(this.excelSheetName, this.excelColumns);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="cp_kyc_template.xlsx"`);
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
    res.setHeader('Content-Disposition', `attachment; filename="cp_kyc_${Date.now()}.xlsx"`);
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
