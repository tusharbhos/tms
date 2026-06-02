import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, Res, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '../../../common/decorators/public.decorator';
import { ExcelService, ColumnDef  } from '../../../common/services/excel.service';
import { CustContractSlabDefinitionService } from './cust-contract-slab-definition.service';
import { CreateCustContractSlabDefinitionSchema, CreateCustContractSlabDefinitionDto } from './dto/create-cust-contract-slab-definition.dto';
import { UpdateCustContractSlabDefinitionSchema, UpdateCustContractSlabDefinitionDto } from './dto/update-cust-contract-slab-definition.dto';
import { FilterCustContractSlabDefinitionSchema, FilterCustContractSlabDefinitionDto } from './dto/filter-cust-contract-slab-definition.dto';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../../common/guards/tenant.guard';
import { CurrentTenant } from '../../../common/decorators/tenant.decorator';
import { CurrentUser } from '../../../common/decorators/user.decorator';

@UseGuards(JwtAuthGuard, TenantGuard)
@ApiTags('masters/contract-slab-definition')
@ApiBearerAuth()
@Controller('masters/contract-slab-definition')
export class CustContractSlabDefinitionController {
  constructor(private readonly service: CustContractSlabDefinitionService,
    private readonly excelService: ExcelService) {}

  @Post()
  create(
    @CurrentTenant() tenantId: number,
    @CurrentUser('id') userId: number,
    @Body(new ZodValidationPipe(CreateCustContractSlabDefinitionSchema)) dto: CreateCustContractSlabDefinitionDto,
  ) {
    return this.service.create(tenantId, userId, dto);
  }

  @Get()
  findAll(
    @CurrentTenant() tenantId: number,
    @Query(new ZodValidationPipe(FilterCustContractSlabDefinitionSchema)) query: FilterCustContractSlabDefinitionDto,
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
    @Body(new ZodValidationPipe(UpdateCustContractSlabDefinitionSchema)) dto: UpdateCustContractSlabDefinitionDto,
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
    { key: 'slabDistanceType', label: 'Slab Distance Type', type: 'string' },
    { key: 'slabContractType', label: 'Slab Contract Type', type: 'string' },
    { key: 'slabRateType', label: 'Slab Rate Type', type: 'string' },
    { key: 'slabNumber', label: 'Slab Number', type: 'string' },
    { key: 'slabLowerLimit', label: 'Slab Lower Limit', type: 'number' },
    { key: 'slabUpperLimit', label: 'Slab Upper Limit', type: 'number' },
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
  private readonly excelSheetName = 'cust_contract_slab_definition';

  @Public()
  @Get('template')
  @ApiOperation({ summary: 'Download blank Excel template' })
  async downloadTemplate(@Res() res: any) {
    const buf = await this.excelService.buildTemplate(this.excelSheetName, this.excelColumns);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="cust_contract_slab_definition_template.xlsx"`);
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
    res.setHeader('Content-Disposition', `attachment; filename="cust_contract_slab_definition_${Date.now()}.xlsx"`);
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
