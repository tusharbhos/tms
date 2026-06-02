import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, Res, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '../../../common/decorators/public.decorator';
import { ExcelService, ColumnDef  } from '../../../common/services/excel.service';
import { CustContractSlabRatesService } from './cust-contract-slab-rates.service';
import { CreateCustContractSlabRatesSchema, CreateCustContractSlabRatesDto } from './dto/create-cust-contract-slab-rates.dto';
import { UpdateCustContractSlabRatesSchema, UpdateCustContractSlabRatesDto } from './dto/update-cust-contract-slab-rates.dto';
import { FilterCustContractSlabRatesSchema, FilterCustContractSlabRatesDto } from './dto/filter-cust-contract-slab-rates.dto';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../../common/guards/tenant.guard';
import { CurrentTenant } from '../../../common/decorators/tenant.decorator';
import { CurrentUser } from '../../../common/decorators/user.decorator';

@UseGuards(JwtAuthGuard, TenantGuard)
@ApiTags('masters/contract-slab-rates')
@ApiBearerAuth()
@Controller('masters/contract-slab-rates')
export class CustContractSlabRatesController {
  constructor(private readonly service: CustContractSlabRatesService,
    private readonly excelService: ExcelService) {}

  @Post()
  create(
    @CurrentTenant() tenantId: number,
    @CurrentUser('id') userId: number,
    @Body(new ZodValidationPipe(CreateCustContractSlabRatesSchema)) dto: CreateCustContractSlabRatesDto,
  ) {
    return this.service.create(tenantId, userId, dto);
  }

  @Get()
  findAll(
    @CurrentTenant() tenantId: number,
    @Query(new ZodValidationPipe(FilterCustContractSlabRatesSchema)) query: FilterCustContractSlabRatesDto,
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
    @Body(new ZodValidationPipe(UpdateCustContractSlabRatesSchema)) dto: UpdateCustContractSlabRatesDto,
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
    { key: 'custContractId', label: 'Cust Contract Id', type: 'number' },
    { key: 'ctrNum', label: 'Ctr Num', type: 'string' },
    { key: 'zone', label: 'Zone', type: 'string' },
    { key: 'fromPlaceId', label: 'From Place Id', type: 'number' },
    { key: 'fromPlace', label: 'From Place', type: 'string' },
    { key: 'toPlaceId', label: 'To Place Id', type: 'number' },
    { key: 'toPlace', label: 'To Place', type: 'string' },
    { key: 'tat', label: 'Tat', type: 'number' },
    { key: 'slabDistanceType', label: 'Slab Distance Type', type: 'string' },
    { key: 'slabContractType', label: 'Slab Contract Type', type: 'string' },
    { key: 'slab1', label: 'Slab1', type: 'number' },
    { key: 'slab2', label: 'Slab2', type: 'number' },
    { key: 'slab3', label: 'Slab3', type: 'number' },
    { key: 'slab4', label: 'Slab4', type: 'number' },
    { key: 'slab5', label: 'Slab5', type: 'number' },
    { key: 'slab6', label: 'Slab6', type: 'number' },
    { key: 'slab7', label: 'Slab7', type: 'number' },
    { key: 'slab8', label: 'Slab8', type: 'number' },
    { key: 'versionNo', label: 'Version No', type: 'number' },
    { key: 'isCurrent', label: 'Is Current', type: 'boolean' },
    { key: 'supersededBy', label: 'Superseded By', type: 'number' },
    { key: 'approvalStatus', label: 'Approval Status', type: 'string' },
    { key: 'approvedBy', label: 'Approved By', type: 'number' },
    { key: 'rejectionReason', label: 'Rejection Reason', type: 'string' },
    { key: 'effectiveFrom', label: 'Effective From', type: 'date' },
    { key: 'effectiveUntil', label: 'Effective Until', type: 'date' },
    { key: 'changeSummary', label: 'Change Summary', type: 'string' },
    { key: 'previousVersionId', label: 'Previous Version Id', type: 'number' },
    { key: 'isActive', label: 'Is Active', type: 'boolean' }
  ];
  private readonly excelSheetName = 'cust_contract_slab_rates';

  @Public()
  @Get('template')
  @ApiOperation({ summary: 'Download blank Excel template' })
  async downloadTemplate(@Res() res: any) {
    const buf = await this.excelService.buildTemplate(this.excelSheetName, this.excelColumns);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="cust_contract_slab_rates_template.xlsx"`);
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
    res.setHeader('Content-Disposition', `attachment; filename="cust_contract_slab_rates_${Date.now()}.xlsx"`);
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
