import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, Res, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '../../../common/decorators/public.decorator';
import { ExcelService, ColumnDef  } from '../../../common/services/excel.service';
import { BankAccountsService } from './bank-accounts.service';
import { CreateBankAccountsSchema, CreateBankAccountsDto } from './dto/create-bank-accounts.dto';
import { UpdateBankAccountsSchema, UpdateBankAccountsDto } from './dto/update-bank-accounts.dto';
import { FilterBankAccountsSchema, FilterBankAccountsDto } from './dto/filter-bank-accounts.dto';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../../common/guards/tenant.guard';
import { CurrentTenant } from '../../../common/decorators/tenant.decorator';
import { CurrentUser } from '../../../common/decorators/user.decorator';

@UseGuards(JwtAuthGuard, TenantGuard)
@ApiTags('vault/bank-accounts')
@ApiBearerAuth()
@Controller('vault/bank-accounts')
export class BankAccountsController {
  constructor(private readonly service: BankAccountsService,
    private readonly excelService: ExcelService) {}

  @Post()
  create(
    @CurrentTenant() tenantId: number,
    @CurrentUser('id') userId: number,
    @Body(new ZodValidationPipe(CreateBankAccountsSchema)) dto: CreateBankAccountsDto,
  ) {
    return this.service.create(tenantId, userId, dto);
  }

  @Get()
  findAll(
    @CurrentTenant() tenantId: number,
    @Query(new ZodValidationPipe(FilterBankAccountsSchema)) query: FilterBankAccountsDto,
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
    @Body(new ZodValidationPipe(UpdateBankAccountsSchema)) dto: UpdateBankAccountsDto,
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
    { key: 'entityType', label: 'Entity Type', type: 'string' },
    { key: 'entityId', label: 'Entity Id', type: 'number' },
    { key: 'accountLabel', label: 'Account Label', type: 'string' },
    { key: 'accountHolder', label: 'Account Holder', type: 'string' },
    { key: 'accountNumber', label: 'Account Number', type: 'string' },
    { key: 'accountType', label: 'Account Type', type: 'string' },
    { key: 'bankName', label: 'Bank Name', type: 'string' },
    { key: 'bankCode', label: 'Bank Code', type: 'string' },
    { key: 'ifscCode', label: 'Ifsc Code', type: 'string' },
    { key: 'branchName', label: 'Branch Name', type: 'string' },
    { key: 'branchAddress', label: 'Branch Address', type: 'string' },
    { key: 'micrCode', label: 'Micr Code', type: 'string' },
    { key: 'cancelledChequeUrl', label: 'Cancelled Cheque Url', type: 'string' },
    { key: 'isPrimary', label: 'Is Primary', type: 'boolean' },
    { key: 'isNachEnabled', label: 'Is Nach Enabled', type: 'boolean' },
    { key: 'nachRef', label: 'Nach Ref', type: 'string' },
    { key: 'verificationStatus', label: 'Verification Status', type: 'string' },
    { key: 'verifiedAt', label: 'Verified At', type: 'date' },
    { key: 'verifiedBy', label: 'Verified By', type: 'number' },
    { key: 'rejectionReason', label: 'Rejection Reason', type: 'string' },
    { key: 'status', label: 'Status', type: 'string' }
  ];
  private readonly excelSheetName = 'bank_accounts';

  @Public()
  @Get('template')
  @ApiOperation({ summary: 'Download blank Excel template' })
  async downloadTemplate(@Res() res: any) {
    const buf = await this.excelService.buildTemplate(this.excelSheetName, this.excelColumns);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="bank_accounts_template.xlsx"`);
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
    res.setHeader('Content-Disposition', `attachment; filename="bank_accounts_${Date.now()}.xlsx"`);
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
